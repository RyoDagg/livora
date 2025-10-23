'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/src/lib/api';
import { toast } from 'react-hot-toast';

import { Listing } from '@/src/types/Listing';

import { HiOutlineCash } from 'react-icons/hi';
import { BsPersonCircle } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRegCalendarAlt } from 'react-icons/fa';

export default function SavedListingsPage() {
  const t = useTranslations('listings');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedListings() {
      try {
        setLoading(true);

        const { data, ok } = await api.get('/saved-listings');
        if (!ok) throw new Error('Failed to fetch');

        setListings(data);
      } catch (err) {
        console.error(err);
        toast.error(t('errors.fetch_saved'));
      } finally {
        setLoading(false);
      }
    }

    fetchSavedListings();
  }, []);

  if (loading) return <p className="text-gray-500 text-center mt-10">{t('loading')}</p>;

  if (listings.length === 0)
    return <p className="text-gray-500 text-center mt-10">{t('no_saved_listings')}</p>;

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      <h1 className="text-2xl font-semibold mb-6">{t('saved_listings')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </main>
  );
}
