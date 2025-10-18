'use client';

import { useEffect, useState } from 'react';
import { forbidden, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ListingInput } from '@/src/types/Listing';
import { api } from '@/src/lib/api';
import { withAuth } from '@/src/lib/withAuth';
import { useAuthStore } from '@/src/lib/store';

import ImagesUploader from '@/src/components/ImagesUploader';
import Loader from '@/src/components/Loader';

import { BsPencilSquare, BsTelephone } from 'react-icons/bs';
import { HiOutlineCash } from 'react-icons/hi';
import { FaSave } from 'react-icons/fa';
import { TUNISIA_REGIONS } from '@/src/constants/regions';

function EditListingPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const t = useTranslations('listings');

  const [form, setForm] = useState<ListingInput | undefined>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const { ok, data } = await api.get(`/listings/${params.id}`);

        if (!ok) throw new Error('Failed to load listing');
        if (user?.id !== data.ownerId) forbidden();

        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          state: data.state,
          type: data.type,
          availableAt: data.availableAt.split('T')[0],
          contact: data.contact,
          imagesURL: data.imagesURL,
        });
      } catch (err) {
        console.error('Error fetching listing', err);
        setError('Could not load listing');
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.id, user?.id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setError('');
    setLoading(true);

    try {
      const { ok, data } = await api.put(`/listings/${params.id}`, {
        ...form,
        price: Number(form.price),
        availableAt: new Date(form.availableAt).toISOString(),
      });

      if (!ok) throw new Error('Failed to update listing');

      setForm({
        title: data.title,
        description: data.description,
        price: data.price,
        state: data.state,
        type: data.type,
        availableAt: data.availableAt.split('T')[0],
        contact: data.contact,
        imagesURL: data.imagesURL,
      });
    } catch (err) {
      console.error('Error updating listing', err);
      setError('Could not update listing');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-6 flex justify-center mt-12">
        <Loader />
      </main>
    );
  }

  if (!form) {
    return <main className="p-6 text-center text-red-500">{error || 'Listing not found'}</main>;
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('edit')}</h1>
            <p className="text-gray-500">{t('edit_description')}</p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary-500 text-white px-4 py-3 font-bold hover:bg-primary-400 disabled:opacity-50"
          >
            <FaSave className="text-2xl" />
            {t('save_changes')}
          </button>
        </header>

        {/* Title */}
        <div className="flex items-center gap-2 border-b border-gray-300 shadow-xs p-3 focus-within:ring-2 focus-within:ring-primary-400">
          <input
            id="title"
            name="title"
            placeholder={t('fields.title')}
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
          <label htmlFor="description" className="block text-sm text-gray-700 font-medium mb-1">
            {t('fields.description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full text-gray-800 border border-gray-300 rounded-sm p-3 shadow-xs outline-0 focus:ring-2 focus:ring-primary-400"
            rows={4}
            placeholder={t('placeholders.description')}
            required
          />
        </div>

        {/* Price + State */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm text-gray-700 font-medium mb-1">
              {t('fields.price')}
            </label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-sm p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-400">
              <input
                id="price"
                name="price"
                type="number"
                placeholder={t('placeholders.price')}
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
              {t('fields.state')}
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm p-3 shadow-sm focus:ring-2 focus:ring-primary-400"
              required
            >
              <option value="">{t('placeholders.state')}</option>
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
              {t('fields.type')}
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm p-3 shadow-sm focus:ring-2 focus:ring-primary-400"
            >
              <option value="rent">{t('rent')}</option>
              <option value="sale">{t('sale')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="availableAt" className="block text-gray-700 text-sm font-medium mb-1">
              {t('fields.available_at')}
            </label>

            <div className="flex items-center gap-2 border border-gray-300 rounded-sm p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-400">
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
        <div className="flex items-center gap-2 border border-gray-300 rounded-sm p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-400">
          <BsTelephone className="text-gray-500" />
          <input
            name="contact"
            placeholder={t('placeholders.contact')}
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary-500 text-white px-4 py-3 font-bold hover:bg-primary-400 disabled:opacity-50"
          >
            <FaSave className="text-2xl" />
            {t('save_changes')}
          </button>
        </div>
      </form>
    </main>
  );
}

export default withAuth(EditListingPage);
