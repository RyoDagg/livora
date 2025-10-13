import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-primary-900 text-white  py-24"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-24 gap-16">
          {/* Left Content */}
          <div className="text-center md:text-left max-w-md md:max-w-xl space-y-6">
            <p className="text-3xl font-bold text-secondary-500">Livora</p>

            <h1 className="text-3xl md:text-5xl leading-tight text-gray-100 capitalize">
              Découvrez <span className="font-bold italic">gratuitement</span> les meilleures offres
              immobilières.
            </h1>

            <p className="text-xl text-gray-200">
              Parcourez et publiez annonces immobilières en toute simplicité.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/listings"
                className="px-6 py-3 bg-secondary-500 text-white font-semibold text-lg shadow hover:bg-secondary-400 transition"
              >
                Parcourir les annonces
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden justify-center w-full lg:flex">
            <Image
              src="/hero-image.png"
              alt="Hero illustration"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Subhero Section */}
      <section
        className="relative py-24"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-24 gap-16">
          {/* Left Content */}
          <div className="text-center md:text-left max-w-md md:max-w-xl space-y-6">
            <p className="text-3xl font-bold text-secondary-500">Livora</p>

            <h1 className="text-3xl md:text-5xl leading-tight text-gray-100 capitalize">
              Découvrez <span className="font-bold italic">gratuitement</span> les meilleures offres
              immobilières.
            </h1>

            <p className="text-xl text-gray-200">
              Parcourez et publiez annonces immobilières en toute simplicité.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/listings"
                className="px-6 py-3 bg-secondary-500 text-white font-semibold text-lg shadow hover:bg-secondary-400 transition"
              >
                Parcourir les annonces
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden justify-center w-full lg:flex">
            <Image
              src="/hero-image.png"
              alt="Hero illustration"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Footer (placeholder for now) */}
      <footer className="py-6 flex flex-wrap items-center justify-center text-gray-500 text-sm bg-gray-50">
        © {new Date().getFullYear()} Livora — Tous droits réservés
      </footer>
    </main>
  );
}
