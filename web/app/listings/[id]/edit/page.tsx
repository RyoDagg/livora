"use client";

import { useEffect, useState } from "react";
import { forbidden, useParams } from "next/navigation";
import { ListingInput } from "@/src/types/Listing";
import { withAuth } from "@/src/lib/withAuth";
import ImagesUploader from "@/src/components/ImagesUploader";
import { BsPencilSquare, BsTelephone } from "react-icons/bs";
import { HiOutlineCash } from "react-icons/hi";
import { api } from "@/src/lib/api";
import Loader from "@/src/components/Loader";
import { useAuthStore } from "@/src/lib/store";

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

function EditListingPage() {
  const params = useParams();
  const { user } = useAuthStore();

  const [form, setForm] = useState<ListingInput | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { ok, data } = await api(`/listings/${params.id}`);

        if (!ok) throw new Error("Failed to load listing");
        if (user?.id !== data.ownerId) forbidden();

        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          state: data.state,
          type: data.type,
          availableAt: data.availableAt.split("T")[0],
          contact: data.contact,
          imageURL: data.imageURL,
        });
      } catch (err: any) {
        setError(err.message || "Could not load listing");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.id, user?.id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setError("");
    setLoading(true);

    try {
      const { ok, data } = await api(`/listings/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          availableAt: new Date(form.availableAt).toISOString(),
        }),
      });

      if (!ok) throw new Error("Failed to update listing");

      setForm({
        title: data.title,
        description: data.description,
        price: data.price,
        state: data.state,
        type: data.type,
        availableAt: data.availableAt.split("T")[0],
        contact: data.contact,
        imageURL: data.imageURL,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-6 flex justify-center">
        <Loader />
      </main>
    );
  }

  if (!form) {
    return (
      <main className="p-6 text-center text-red-500">
        {error || "Listing not found"}
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Listing</h1>
        <p className="text-gray-500">Update your property details</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 bg-white p-6 rounded-xl shadow"
      >
        {/* Title */}
        <div className="flex items-center gap-2 border-b border-gray-300 shadow-xs p-3 focus-within:ring-2 focus-within:ring-green-400">
          <input
            id="title"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="flex-1 outline-none text-gray-700 text-lg font-medium"
          />
          <label htmlFor="title">
            <BsPencilSquare className="text-gray-500 text-3xl" />
          </label>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full text-gray-800 border border-gray-300 rounded-lg p-3 shadow-xs outline-0 focus:ring-2 focus:ring-green-400"
            rows={4}
            placeholder="Describe the property..."
            required
          />
        </div>

        {/* Price + State */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm text-gray-700 font-medium mb-1"
            >
              Price (TND)
            </label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
              <input
                id="price"
                name="price"
                type="number"
                placeholder="e.g 350(TND)"
                value={form.price}
                onChange={handleChange}
                className="flex-1 outline-none text-gray-800 font-medium"
                required
              />
              <HiOutlineCash className="text-gray-500 text-2xl" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Governorate
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-green-400"
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
        </div>

        {/* Type + Date */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-green-400"
            >
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="availableAt"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Available From
            </label>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
              <input
                id="availableAt"
                name="availableAt"
                type="date"
                value={form.availableAt}
                onChange={handleChange}
                required
                className="flex-1 font-medium text-gray-800 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
          <BsTelephone className="text-gray-500" />
          <input
            name="contact"
            placeholder="Phone / Email"
            value={form.contact}
            onChange={handleChange}
            required
            className="flex-1 outline-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <ImagesUploader form={form} setForm={setForm} />
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 flex justify-center"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

export default withAuth(EditListingPage);
