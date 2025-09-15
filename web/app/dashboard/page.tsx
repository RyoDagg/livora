'use client';
import { withAuth } from '@/src/lib/withAuth';
import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/lib/store';

function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        const { ok, data } = await api(`/listings?ownerId=${user.id}`);
        if (!ok) throw new Error('Failed to fetch your listings');
        setListings(data);
      } catch (err: any) {
        console.error('Error fetching listings', err);
        setError('Something went wrong while loading your listings.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  function formatPrice(value: number) {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
    }).format(value);
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
        <Link
          href="/listings/create"
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          + New Listing
        </Link>
      </header>

      {loading && <p className="text-gray-500">Loading your listings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {listings.length === 0 ? (
            <p className="text-gray-600 italic">You don’t have any listings yet.</p>
          ) : (
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-t">
                    <td className="p-3">{listing.title}</td>
                    <td className="p-3 capitalize">{listing.type}</td>
                    <td className="p-3">{formatPrice(listing.price)}</td>
                    <td className="p-3">{listing.state}</td>
                    <td className="p-3 flex gap-2">
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}

export default withAuth(DashboardPage);
