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
          ? 'border-primary-500 text-gray-900'
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
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-x-4">
          {/* Logo */}
          <div className="text-3xl font-bold text-gray-800 w-20 min-w-20">
            <Link href="/">
              <Image
                width={120}
                height={120}
                src={'/logo.png'}
                alt="Profile"
                className="w-auto max-h-12"
              />
            </Link>
          </div>

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
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                  >
                    <Image
                      width={40}
                      height={40}
                      src={user.avatarUrl || '/default-avatar.png'}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-primary-500 transition"
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
                          src={user.avatarUrl || '/default-avatar.png'}
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
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                    href="/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium shadow-sm text-white bg-primary-500 hover:bg-primary-500/70"
                  >
                    {t('user.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium shadow-sm text-white bg-primary-500 hover:bg-primary-500/70"
                  >
                    {t('user.register')}
                  </Link>
                </div>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="sm:hidden p-2 ml-auto rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile sliding menu */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />

          {/* Sliding drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-out ${
              mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="flex flex-col p-4">
              <div className="flex flex-col space-y-2 mb-4">
                <NavLink href="/listings">{t('listings.title')}</NavLink>
                {user && <NavLink href="/listings/create">{t('listings.create')}</NavLink>}
                {user && <NavLink href="/dashboard">{t('dashboard.title')}</NavLink>}
              </div>
              <hr className="my-2 border-gray-300" />

              {!loading &&
                (user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 font-medium hover:bg-gray-50 px-4 py-2 rounded-md"
                    >
                      {t('user.profile')}
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 font-medium hover:bg-gray-50 px-4 py-2 rounded-md"
                    >
                      Saved Listings
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 font-medium hover:bg-gray-50 px-4 py-2 rounded-md"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-md text-left"
                    >
                      {t('user.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-500/80"
                    >
                      {t('user.login')}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-500/80"
                    >
                      {t('user.register')}
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
