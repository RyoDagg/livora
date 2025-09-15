import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BsHousesFill, BsPersonCircle } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRegCalendarAlt, FaSearch } from 'react-icons/fa';
import { GiTunisia } from 'react-icons/gi';
import { HiOutlineCash } from 'react-icons/hi';

export const metadata: Metadata = {
  title: 'Listings - Livora',
  description: 'Browse the latest real estate listings in Tunisia.',
};

async function fetchListings(): Promise<Listing[]> {
  const { ok, data } = await api('/listings', {
    next: { revalidate: 10 },
  });
  if (!ok) throw new Error('Failed to fetch listings');
  return data;
}

function InputWithIcon({ icon, placeholder }: { icon: React.ReactNode; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:border-gray-500 transition">
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}

export default async function ListingsPage() {
  const listings = await fetchListings();

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl text-gray-800 font-bold">
          <BsHousesFill className="text-[#53ba04] text-4xl" /> Listings
        </h1>

        <p className="text-gray-600">Browse the latest real estate offers</p>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap gap-3 mb-8">
        <InputWithIcon
          icon={<FaSearch className="text-gray-500" />}
          placeholder="Search listings..."
        />
        <InputWithIcon
          icon={<GiTunisia className="text-gray-500 text-xl" />}
          placeholder="Filter by state..."
        />
      </section>

      {/* No Results */}
      {listings.length === 0 && <p className="text-gray-500 italic">No listings found.</p>}

      {/* Listings */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-xl shadow hover:shadow-lg transition overflow-hidden bg-white flex flex-col border border-gray-200"
          >
            <Image
              src={listing.imageURL || '/listing-placeholder.png'}
              alt={listing.title}
              width={400}
              height={250}
              className="object-cover w-full h-52 border-b-2 border-gray-200"
            />
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold mb-1">
                <Link href={`/listings/${listing.id}`} className="hover:underline">
                  {listing.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{listing.description}</p>

              {/* Info tags */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 bg-green-50 text-green-950 font-medium px-2 py-1 rounded-full">
                  <HiOutlineCash />{' '}
                  {new Intl.NumberFormat('fr-TN', {
                    style: 'currency',
                    currency: 'TND',
                  }).format(listing.price)}
                </span>
                <span className="flex items-center gap-2 bg-blue-50 text-blue-950 font-medium px-2 py-1 rounded-full">
                  <FaHome /> {listing.type}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 text-gray-950 font-medium px-2 py-1 rounded-full">
                  <FaMapMarkerAlt /> {listing.state}
                </span>
                <span className="flex items-center gap-2 bg-yellow-50 text-yellow-950 font-medium px-2 py-1 rounded-full">
                  <FaRegCalendarAlt /> {new Date(listing.availableAt).toLocaleDateString('fr-TN')}
                </span>
                <span className="flex items-center gap-2 bg-purple-50 text-purple-950 font-medium px-2 py-1 rounded-full">
                  <FaPhoneAlt /> {listing.contact}
                </span>
                <span className="flex items-center gap-2 bg-pink-50 text-pink-950 font-medium px-2 py-1 rounded-full">
                  <BsPersonCircle /> {listing.owner.name ?? listing.owner.email}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
