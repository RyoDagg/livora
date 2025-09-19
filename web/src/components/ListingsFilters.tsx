'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { GiTunisia } from 'react-icons/gi';
import { useTranslations } from 'next-intl';

const TUNISIA_REGIONS = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kebili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Medenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
];

export default function ListingsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('listings');

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [state, setState] = useState(searchParams.get('state') || '');

  // Debounce search + push filters
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      // query
      if (query) params.set('query', query);
      else params.delete('query');

      // state
      if (state) params.set('state', state);
      else params.delete('state');

      router.replace(`/listings?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, state]);

  return (
    <section className="flex flex-wrap gap-3 mb-8">
      {/* Search input */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:border-gray-500 transition">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder={t('filter.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none text-sm placeholder-gray-400"
        />
      </div>

      {/* State select */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:border-gray-500 transition">
        <GiTunisia className="text-gray-500 text-xl" />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
        >
          <option value="">{t('filter.state')}</option>
          {TUNISIA_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
