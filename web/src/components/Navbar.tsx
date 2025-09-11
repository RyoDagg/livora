"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/listings", label: "Listings" },
  { href: "/listings/create", label: "Create Listing" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Livora
            </Link>
            <div className="hidden w-4xl sm:flex sm:ml-6 sm:space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center px-4 pt-1 border-b-3 font-medium ${
                    pathname === href
                      ? "border-[#53ba04] text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="hidden sm:flex sm:items-center">
              <Link
                href="/profile"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
