import { ListingInput } from "../types/Listing";
import { api } from "./api";

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
