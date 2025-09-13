import Image from "next/image";
import { api } from "@/src/lib/api";
import { Listing } from "@/src/types/Listing";
import { BsCurrencyDollar, BsPersonCircle } from "react-icons/bs";
import {
  FaHome,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaPhoneAlt,
} from "react-icons/fa";

async function fetchListing(id: string): Promise<Listing> {
  const { ok, data } = await api(`/listings/${id}`, {
    next: { revalidate: 10 },
  });

  if (!ok) throw new Error("Failed to fetch listing");
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

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await fetchListing(params.id);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <article className="bg-white shadow rounded-xl overflow-hidden">
        {/* Image */}
        <div className="relative h-72 w-full">
          <Image
            src={listing.imageURL || "/listing-placeholder.png"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <p className="text-gray-700">{listing.description}</p>

          {/* Info Tags */}
          <div className="flex flex-wrap gap-2">
            <InfoTag
              icon={<BsCurrencyDollar />}
              className="bg-green-50 text-green-950"
            >
              {new Intl.NumberFormat("fr-TN", {
                style: "currency",
                currency: "TND",
              }).format(listing.price)}
            </InfoTag>

            <InfoTag icon={<FaHome />} className="bg-blue-50 text-blue-950">
              {listing.type}
            </InfoTag>

            <InfoTag
              icon={<FaMapMarkerAlt />}
              className="bg-gray-50 text-gray-950"
            >
              {listing.state}
            </InfoTag>

            <InfoTag
              icon={<FaRegCalendarAlt />}
              className="bg-yellow-50 text-yellow-950"
            >
              {new Date(listing.availableAt).toLocaleDateString("fr-TN")}
            </InfoTag>

            <InfoTag
              icon={<FaPhoneAlt />}
              className="bg-purple-50 text-purple-950"
            >
              {listing.contact}
            </InfoTag>

            <InfoTag
              icon={<BsPersonCircle />}
              className="bg-pink-50 text-pink-950"
            >
              {listing.owner.name ?? listing.owner.email}
            </InfoTag>
          </div>
        </div>
      </article>
    </main>
  );
}
