'use client';

import { FaBookmark, FaPaperPlane } from 'react-icons/fa';
import { useAuthStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

function ListingCTA({ listingId }: { listingId: string }) {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSavedStatus = async () => {
      try {
        const { ok, data } = await api.get(`/saved-listings/${listingId}`);
        if (!ok) throw new Error('Failed to fetch saved status');

        setSaved(data);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      }
    };

    fetchSavedStatus();
  }, [user, listingId]);

  if (!user) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <button className="flex-1 sm:flex-none px-5 py-2 bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition">
        <FaPaperPlane className="inline mr-2" />
        Contacter
      </button>

      <button
        onClick={() => {
          alert('Listing saved to your favorites!');
        }}
        className="flex-1 sm:flex-none px-5 py-2 bg-primary-500 text-white font-semibold hover:bg-primary-600 transition"
      >
        <FaBookmark className="inline mr-2" />
        Enregistrer
      </button>
    </div>
  );
}

export default ListingCTA;
