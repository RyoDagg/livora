import { api } from "@/src/lib/api";
import { Listing } from "@/src/types/Listing";
import Link from "next/link";

async function fetchListings(): Promise<Listing[]> {
  const { ok, data } = await api("/listings", {
    next: { revalidate: 10 },
  });
  if (!ok) throw new Error("Failed to fetch listings");
  return data;
}

export default async function ListingsPage() {
  const listings = await fetchListings();

  return (
    <main className="p-6 max-w-3xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl mb-4">Listings</h1>
      {listings.length === 0 && <p>No listings found.</p>}
      {listings.map((listing) => (
        <div key={listing.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold">
            <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
          </h2>
          <p>{listing.description}</p>
          <p>
            <strong>Price:</strong> {listing.price} TND
          </p>
          <p>
            <strong>Type:</strong> {listing.type}
          </p>
          <p>
            <strong>State:</strong> {listing.state}
          </p>
          <p>
            <strong>Available At:</strong>{" "}
            {new Date(listing.availableAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Contact:</strong> {listing.contact}
          </p>
          <p>
            <strong>Owner:</strong> {listing.owner.name ?? listing.owner.email}
          </p>
        </div>
      ))}
    </main>
  );
}
