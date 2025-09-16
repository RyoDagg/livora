import { useEffect, useRef, useState } from 'react';
import { BsGlobe2 } from 'react-icons/bs';
import { setLocale } from '../lib/setLocale';
import Image from 'next/image';

export default function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer gap-1 px-2 py-1 text-sm font-medium text-blue-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#53ba04] rounded-md"
      >
        <BsGlobe2 className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-md border border-gray-100 py-1 z-50">
          <button
            onClick={() => {
              setLocale('en');
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Image src="/flags/en.png" alt="en" width={16} height={16} />
            English
          </button>
          <button
            onClick={() => {
              setLocale('fr');
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Image src="/flags/fr.png" alt="fr" width={16} height={16} />
            Français
          </button>
        </div>
      )}
    </div>
  );
}
