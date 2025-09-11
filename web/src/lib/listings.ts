import { api } from "./api";

export type ListingInput = {
  title: string;
  description: string;
  price: number;
  state: string;
  type: "rent" | "sale";
  availableAt: string; // ISO string
  contact: string;
};

export async function createListing(data: ListingInput) {
  const res = await api("/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.error || "Failed to create listing");
  }
  return res.data;
}
