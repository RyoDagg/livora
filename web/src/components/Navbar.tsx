'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { HiMenu, HiX, HiCog, HiLogout, HiBookmark } from 'react-icons/hi';
import Image from 'next/image';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/store';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`inline-flex items-center px-4 py-1 border-b-4 font-medium transition ${
        isActive
          ? 'border-[#53ba04] text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { user, loading } = useAuth();

  const t = useTranslations();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-gray-800 ml-12">
            Livora
          </Link>

          {/* Desktop nav */}
          <div className="hidden w-2xl mx-auto sm:flex sm:space-x-8">
            <NavLink href="/listings">{t('listings.title')}</NavLink>
            {user && <NavLink href="/listings/create">{t('listings.create')}</NavLink>}
            {user && <NavLink href="/dashboard">{t('dashboard.title')}</NavLink>}
          </div>

          {/* Desktop auth / profile */}
          <div className="hidden sm:flex sm:items-center justify-end gap-4 relative w-48">
            <LocaleSwitcher />

            {!loading &&
              (user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#53ba04] rounded-full"
                  >
                    <Image
                      width={40}
                      height={40}
                      src={'/default-avatar.png'}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-[#53ba04] transition"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-xl py-2 border border-gray-100 ring-1 ring-black/5 transition animate-fadeIn">
                      <Link
                        href="/profile"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Image
                          width={40}
                          height={40}
                          src={'/default-avatar.png'}
                          alt="Profile"
                          className="h-6 w-6 rounded-full"
                        />
                        {t('user.profile')}
                      </Link>
                      <Link
                        href="/favorites"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HiBookmark className="text-gray-500" aria-hidden="true" /> Saved Listings
                      </Link>
                      <Link
                        href="/settings"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HiCog className="text-gray-500" aria-hidden="true" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <HiLogout className="text-red-500" aria-hidden="true" />
                        {t('user.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    {t('user.login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    {t('user.register')}
                  </Link>
                </div>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="sm:hidden p-2 ml-auto rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#53ba04]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-gray-200 px-4 pb-4 transition-all duration-150 ease-out"
        >
          <div className="flex flex-col space-y-2 mt-2">
            <NavLink href="/listings">{t('listings.title')}</NavLink>
            {user && <NavLink href="/listings/create">{t('listings.create')}</NavLink>}
            {user && <NavLink href="/dashboard">{t('dashboard.title')}</NavLink>}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    {t('user.profile')}
                  </Link>
                  <Link
                    href="/favorites"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Saved Listings
                  </Link>
                  <Link
                    href="/settings"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    {t('user.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    {t('user.login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    {t('user.register')}
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
