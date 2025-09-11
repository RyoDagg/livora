"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/src/lib/listings";
import { ListingInput } from "@/src/types/Listing";
import { withAuth } from "@/src/lib/withAuth";

const TUNISIA_REGIONS = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kebili",
  "Kef",
  "Mahdia",
  "Manouba",
  "Medenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

function CreateListingPage() {
  const router = useRouter();
  const [form, setForm] = useState<ListingInput>({
    title: "",
    description: "",
    price: 0,
    state: "",
    type: "sale",
    availableAt: "",
    contact: "",
  });
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createListing({
        ...form,
        price: Number(form.price),
        availableAt: new Date(form.availableAt).toISOString(),
      });
      router.push("/listings");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (TND)</label>
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Governorate</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">Select a region</option>
            {TUNISIA_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Available At</label>
          <input
            name="availableAt"
            type="date"
            value={form.availableAt}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input
            name="contact"
            placeholder="Contact (phone/email)"
            value={form.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Create
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </main>
  );
}

export default withAuth(CreateListingPage);
