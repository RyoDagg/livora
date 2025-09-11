"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, ListingInput } from "@/src/lib/listings";

export default function CreateListingPage() {
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
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <input
          name="availableAt"
          type="date"
          value={form.availableAt}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="contact"
          placeholder="Contact (phone/email)"
          value={form.contact}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white py-2 rounded">
          Create
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </main>
  );
}
