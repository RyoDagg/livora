"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { HiMenu, HiX, HiCog, HiLogout, HiBookmark } from "react-icons/hi";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex items-center px-4 pt-1 border-b-3 font-medium ${
        isActive
          ? "border-[#53ba04] text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <NavLink href="/listings">Listings</NavLink>
            {user && <NavLink href="/listings/create">Create Listing</NavLink>}
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
          </div>

          {/* Desktop auth / profile */}
          <div className="hidden sm:flex sm:items-center justify-end relative w-48">
            {!loading &&
              (user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={"/default-avatar.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-[#53ba04] transition"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl py-2 border border-gray-100 animate-fadeIn">
                      <Link
                        href="/profile"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <img
                          src={"/default-avatar.png"}
                          alt="Profile"
                          className="h-6 w-6 rounded-full"
                        />
                        Profile
                      </Link>
                      <Link
                        href="/favorites"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HiBookmark className="text-gray-500" /> Saved Listings
                      </Link>
                      <Link
                        href="/settings"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HiCog className="text-gray-500" /> Settings
                      </Link>
                      <button className="w-full text-left px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <HiLogout className="text-red-500" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="sm:hidden p-2 ml-auto rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 px-4 pb-4">
          <div className="flex flex-col space-y-2 mt-2">
            <NavLink href="/listings">Listings</NavLink>
            {user && <NavLink href="/listings/create">Create Listing</NavLink>}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Profile
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
                  <button className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-red-600 bg-red-50 hover:bg-red-100">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center px-4 py-2 rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/70"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
