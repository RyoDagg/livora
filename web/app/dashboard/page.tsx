'use client';

import { withAuth } from '@/src/lib/withAuth';
import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/lib/store';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';

function DashboardPage() {
  const { user } = useAuthStore();
  const t = useTranslations();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchData() {
    if (!user) return;
    try {
      setLoading(true);
      const { ok, data } = await api.get(`/listings?ownerId=${user.id}`);
      if (!ok) throw new Error('Failed to fetch your listings');
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings', err);
      setError(t('dashboard.errors.load'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  async function handleDelete(listingId: string) {
    try {
      if (!confirm(t('dashboard.confirmDelete'))) return;

      const { ok } = await api.delete(`/listings/${listingId}`);
      if (!ok) throw new Error('Failed to delete the listing');

      toast.success(t('dashboard.toast.deleted'));
      fetchData();
    } catch (err) {
      console.error('Error deleting listing', err);
      toast.error(t('dashboard.toast.deleteError'));
    }
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
    }).format(value);
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{t('listings.mine')}</h1>
          <p className="text-gray-500 text-sm">{t('dashboard.subtitle')}</p>
        </div>

        <Link
          href="/listings/create"
          className="px-5 py-2.5 bg-primary-500 text-white font-medium hover:bg-primary-600 transition"
        >
          {t('listings.new')}
        </Link>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-500">{t('loading')}</div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center bg-red-50 border border-red-200 py-3 rounded-lg">
          {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
          <Image
            src="/empty-listings.png"
            alt="No listings illustration"
            width={200}
            height={200}
            className="opacity-90"
          />
          <p className="text-gray-600 text-lg">{t('dashboard.empty')}</p>
          <Link
            href="/listings/create"
            className="px-5 py-2.5 bg-primary-500 text-white font-medium hover:bg-primary-600 transition"
          >
            {t('listings.new')}
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && !error && listings.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">{t('listings.fields.title')}</th>
                <th className="p-3">Images</th>
                <th className="p-3">{t('listings.fields.type')}</th>
                <th className="p-3">{t('listings.fields.price')}</th>
                <th className="p-3">{t('listings.fields.state')}</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-t hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 font-medium text-gray-800">{listing.title}</td>

                  <td className="p-3">
                    <div className="flex -space-x-2">
                      {listing.imagesURL?.slice(0, 3).map((url, idx) => (
                        <div
                          key={idx}
                          className="relative w-12 h-12 rounded overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={url}
                            alt={`${listing.title} image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {listing.imagesURL?.length > 3 && (
                        <span className="w-10 h-10 flex items-center justify-center text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">
                          +{listing.imagesURL.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-4 py-2 rounded-full font-medium ${
                        listing.type === 'sale'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {t(`listings.${listing.type}`)}
                    </span>
                  </td>
                  <td className="p-3">{formatPrice(listing.price)}</td>
                  <td className="p-3">{listing.state}</td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('actions.edit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      {t('actions.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default withAuth(DashboardPage);
