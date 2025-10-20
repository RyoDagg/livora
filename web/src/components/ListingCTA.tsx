'use client';

import { FaBookmark, FaPaperPlane } from 'react-icons/fa';
import { Listing } from '../types/Listing';
import { useAuthStore } from '../lib/store';

function ListingCTA({ listing }: { listing?: Listing }) {
  const { user } = useAuthStore();
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
