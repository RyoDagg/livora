import { BsPersonCircle } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaPhoneAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { HiOutlineCash } from 'react-icons/hi';

import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';

import ImagesSection from '@/src/components/ImagesSection';
import ListingCTA from '@/src/components/ListingCTA';
import { Metadata } from 'next';

async function fetchListing(id: string): Promise<Listing> {
  const { ok, data } = await api.get(`/listings/${id}`, { next: { revalidate: 10 } });

  if (!ok) throw new Error('Failed to fetch listing');
  return data;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await fetchListing(params.id);

  const title = `${listing.title} - ${listing.state} | Livora`;
  const description =
    listing.description?.slice(0, 160) ||
    `Découvrez cette propriété à ${listing.state} sur Livora.`;

  const image = listing.imagesURL?.[0] ? listing.imagesURL[0] : '/og-image.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://livora.tn/listings/${listing.id}`,
      siteName: 'Livora',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      locale: 'fr_FR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
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

          <ListingCTA listingId={listing.id} />

          {/* Description */}
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
        </section>
      </article>
    </main>
  );
}
