'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { FaPaperPlane, FaRegBookmark } from 'react-icons/fa';
import { BsBookmarkCheckFill } from 'react-icons/bs';

import { useAuthStore } from '../lib/store';
import { api } from '../lib/api';

function ListingCTA({ listingId }: { listingId: string }) {
  const t = useTranslations('listings');
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSavedStatus = async () => {
      try {
        setLoading(true);
        const { ok, data } = await api.get(`/saved-listings/${listingId}`);
        if (!ok) throw new Error('Failed to fetch saved status');

        setSaved(data);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStatus();
  }, [user, listingId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { ok } = await api.post(`/saved-listings/${listingId}`);
      if (!ok) throw new Error('Failed to save listing');

      setSaved(true);
    } catch (error) {
      console.error('Error saving listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setLoading(true);

      const { ok } = await api.delete(`/saved-listings/${listingId}`);
      if (!ok) throw new Error('Failed to unsave listing');

      setSaved(false);
    } catch (error) {
      console.error('Error unsaving listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <button className="flex-1 sm:flex-none px-5 py-2 bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition">
        <FaPaperPlane className="inline mr-2" />
        {t('contact_owner')}
      </button>

      {saved && (
        <button
          onClick={handleUnsave}
          disabled={loading}
          className="flex-1 sm:flex-none px-5 py-2 border-2 border-transparent bg-primary-500 text-white font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BsBookmarkCheckFill className="inline mr-2 text-xl" />
          {loading ? t('loading') : t('saved_listing')}
        </button>
      )}

      {!saved && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 sm:flex-none px-5 py-2 border-2 border-primary-500 text-primary-500 font-semibold hover:bg-primary-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaRegBookmark className="inline mr-2 text-xl" />
          {loading ? t('loading') : t('save_listing')}
        </button>
      )}
    </div>
  );
}

export default ListingCTA;
