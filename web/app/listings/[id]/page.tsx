import { api } from "@/src/lib/api";
import { Listing } from "@/src/types/Listing";

async function fetchListing(id: string): Promise<Listing> {
  const { ok, data } = await api(`/listings/${id}`, {
    next: { revalidate: 10 },
  });

  if (!ok) throw new Error("Failed to fetch listing");
  return data;
}

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const data = await fetchListing(id);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p>{data.description}</p>
      <p>
        <strong>Price:</strong> {data.price} TND
      </p>
      <p>
        <strong>Type:</strong> {data.type}
      </p>
      <p>
        <strong>State:</strong> {data.state}
      </p>
      <p>
        <strong>Available At:</strong>{" "}
        {new Date(data.availableAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Contact:</strong> {data.contact}
      </p>
      <p>
        <strong>Owner:</strong> {data.owner.name ?? data.owner.email}
      </p>
    </main>
  );
}
