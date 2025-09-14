"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Livora
            </Link>
            <div className="hidden w-4xl sm:flex sm:ml-6 sm:space-x-8">
              <Link
                href={"/listings"}
                className={`inline-flex items-center px-4 pt-1 border-b-3 font-medium ${
                  pathname === "/listings"
                    ? "border-[#53ba04] text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Listings
              </Link>

              {user && (
                <Link
                  href={"/listings/create"}
                  className={`inline-flex items-center px-4 pt-1 border-b-3 font-medium ${
                    pathname === "/listings/create"
                      ? "border-[#53ba04] text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Create Listing
                </Link>
              )}
            </div>
            <div className="hidden sm:flex sm:items-center">
              {!loading &&
                (user ? (
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53ba04]"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#53ba04] hover:bg-[#53ba04]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53ba04]"
                  >
                    Login
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
