import Image from 'next/image';
import { api } from '@/src/lib/api';
import { Listing } from '@/src/types/Listing';
import { BsPersonCircle } from 'react-icons/bs';
import { FaHome, FaMapMarkerAlt, FaRegCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

async function fetchListing(id: string): Promise<Listing> {
  const { ok, data } = await api.get(`/listings/${id}`, {
    next: { revalidate: 10 },
  });

  if (!ok) throw new Error('Failed to fetch listing');
  return data;
}

function InfoTag({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${className}`}
    >
      {icon} {children}
    </span>
  );
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await fetchListing(params.id);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow rounded-xl overflow-hidden">
        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={listing.imageURL || '/listing-placeholder.png'}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails (for now just repeat main) */}
          <div className="grid grid-cols-4 gap-2">
            {[listing.imageURL, listing.imageURL, listing.imageURL, listing.imageURL].map(
              (img, i) => (
                <div key={i} className="relative h-20 w-full rounded-md overflow-hidden">
                  <Image
                    src={img || '/listing-placeholder.png'}
                    alt={`${listing.title} ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-between p-4">
          {/* Title + description */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-gray-600">{listing.description}</p>

            {/* Price */}
            <p className="text-2xl font-semibold text-green-600">
              {new Intl.NumberFormat('fr-TN', {
                style: 'currency',
                currency: 'TND',
              }).format(listing.price)}
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 mt-4">
              <InfoTag icon={<FaHome />} className="bg-blue-50 text-blue-950">
                {listing.type}
              </InfoTag>

              <InfoTag icon={<FaMapMarkerAlt />} className="bg-gray-50 text-gray-950">
                {listing.state}
              </InfoTag>

              <InfoTag icon={<FaRegCalendarAlt />} className="bg-yellow-50 text-yellow-950">
                {new Date(listing.availableAt).toLocaleDateString('fr-TN')}
              </InfoTag>

              <InfoTag icon={<FaPhoneAlt />} className="bg-purple-50 text-purple-950">
                {listing.contact}
              </InfoTag>

              <InfoTag icon={<BsPersonCircle />} className="bg-pink-50 text-pink-950">
                {listing.owner.name ?? listing.owner.email}
              </InfoTag>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <button className="w-full md:w-auto px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition">
              Contacter le propriétaire
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
