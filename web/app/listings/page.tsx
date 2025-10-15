import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import ListingsFilters from '@/src/components/ListingsFilters';

import { BsPersonCircle } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { HiOutlineCash } from 'react-icons/hi';

import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';

export const metadata: Metadata = {
  title: 'Listings - Livora',
  description: 'Browse the latest real estate listings in Tunisia.',
};

type ListingsFilters = {
  query?: string;
  state?: string;
};

async function fetchListings(filters: ListingsFilters): Promise<Listing[]> {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString());
    }
  });

  const { ok, data } = await api.get(`/listings?${queryParams.toString()}`, {
    next: { revalidate: 10 },
  });

  if (!ok) throw new Error('Failed to fetch listings');
  return data;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { query, state } = await searchParams;
  const listings = await fetchListings({ query, state });
  const t = await getTranslations('listings');

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-3xl text-gray-800 font-bold">{t('title')}</h1>
        {/* <p className="text-gray-600">{t('description')}</p> */}
      </header>

      <ListingsFilters />

      {/* No Results */}
      {listings.length === 0 && <p className="text-gray-500 italic">{t('no_results')}</p>}

      {/* Listings */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <article
            key={listing.id}
            className="shadow-sm hover:shadow transition overflow-hidden bg-white flex flex-col border border-transparent hover:border-gray-200"
          >
            <Link href={`/listings/${listing.id}`}>
              <Image
                src={listing.imagesURL[0] || '/listing-placeholder.png'}
                alt={listing.title}
                width={400}
                height={250}
                className="object-cover w-full h-52 border-b-2 border-gray-200"
              />
            </Link>

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-base font-medium text-gray-800 mb-1">{listing.title}</h2>
              <p className="flex items-center gap-1 text-lg font-bold text-green-800 mr-auto mb-1">
                <HiOutlineCash />
                {new Intl.NumberFormat('fr-TN', {
                  style: 'currency',
                  currency: 'TND',
                }).format(listing.price)}
              </p>

              {/* Info tags */}
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="flex items-center gap-2 text-blue-950 font-medium px-2 py-1">
                  <FaHome /> {t(listing.type)}
                </span>
                <span className="flex items-center gap-2 text-gray-950 font-medium px-2 py-1">
                  <FaMapMarkerAlt /> {listing.state}
                </span>
                <span className="flex items-center gap-2 text-yellow-950 font-medium px-2 py-1">
                  <FaRegCalendarAlt /> {new Date(listing.availableAt).toLocaleDateString('fr-TN')}
                </span>
                <span className="flex items-center gap-2 text-purple-950 font-medium px-2 py-1">
                  <FaPhoneAlt /> {listing.contact}
                </span>
                <span className="flex items-center gap-2 text-pink-950 font-medium px-2 py-1">
                  <BsPersonCircle /> {listing.owner.name ?? listing.owner.email}
                </span>
              </div>
              <Link
                href={`/listings/${listing.id}`}
                className="ml-auto mt-auto text-white bg-primary-500 font-medium text-sm px-4 py-2 hover:bg-primary-400 transition"
              >
                {t('details')}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
