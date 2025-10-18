import { BsPersonCircle } from 'react-icons/bs';
import {
  FaBookmark,
  FaHome,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import { HiOutlineCash } from 'react-icons/hi';

import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';

import ImagesSection from '@/src/components/ImagesSection';

async function fetchListing(id: string): Promise<Listing> {
  const { ok, data } = await api.get(`/listings/${id}`, {
    next: { revalidate: 10 },
  });

  if (!ok) throw new Error('Failed to fetch listing');
  return data;
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const listing = await fetchListing(id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-24">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <ImagesSection images={listing.imagesURL} title={listing.title} />

        {/* Right: Content */}
        <section className="space-y-6 p-2 sm:p-4">
          <header>
            <h1 className="text-3xl text-gray-800 font-bold">{listing.title}</h1>
            <p className="flex items-center gap-1 text-3xl font-bold text-green-800 mt-2">
              <HiOutlineCash />
              {new Intl.NumberFormat('fr-TN', {
                style: 'currency',
                currency: 'TND',
              }).format(listing.price)}
            </p>
          </header>

          {/* Highlights */}
          <div className="flex flex-wrap gap-x-2 my-4">
            <span className="font-medium px-2 py-1 text-blue-950 text-lg">
              <FaHome className="inline mr-2" />
              {listing.type}
            </span>

            <span className="font-medium px-2 py-1 text-gray-950 text-lg">
              <FaMapMarkerAlt className="inline mr-2" />
              {listing.state}
            </span>

            <span className="font-medium px-2 py-1 text-yellow-950 text-lg">
              <FaRegCalendarAlt className="inline mr-2" />
              {new Date(listing.availableAt).toLocaleDateString('fr-TN')}
            </span>

            <span className="font-medium px-2 py-1 text-purple-950 text-lg">
              <FaPhoneAlt className="inline mr-2" />
              {listing.contact}
            </span>

            <span className="font-medium px-2 py-1 text-pink-950 text-lg">
              <BsPersonCircle className="inline mr-2" />
              {listing.owner.name ?? listing.owner.email}
            </span>
          </div>

          {/* CTA */}
          {false && (
            <div className="flex flex-col sm:flex-row gap-3 my-8">
              <button className="flex-1 sm:flex-none px-5 py-2 bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition">
                <FaPaperPlane className="inline mr-2" />
                Contacter
              </button>

              <button className="flex-1 sm:flex-none px-5 py-2 bg-primary-500 text-white font-semibold hover:bg-primary-600 transition">
                <FaBookmark className="inline mr-2" />
                Enregistrer
              </button>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{listing.description}</p>
        </section>
      </article>
    </main>
  );
}
