import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col space-y-16">
      {/* Hero Section */}
      <section
        className="relative bg-primary-900 text-white py-28"
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
      <section className="grid grid-cols-1 md:grid-cols-2 items-center mx-auto px-6 md:px-8 py-20 md:py-24 gap-10 max-w-7xl">
        {/* Left Content */}
        <div className="text-center md:text-left space-y-6 mx-auto max-w-xl">
          <h2 className="text-3xl lg:text-5xl font-semibold text-gray-800 capitalize">
            Pour les agences
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            Bénéficiez de notre service{' '}
            <span className="font-extrabold text-secondary-500">Gratuit!</span>. Publiez et gérez
            vos annonces <span className="font-extrabold text-secondary-500">sans frais</span>, tout
            en augmentant leur visibilité facilement.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/listings/create"
              className="px-6 py-3 bg-primary-800 text-white font-semibold text-lg shadow hover:bg-primary-700 transition-colors duration-200"
            >
              Commencer
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/deal.png"
            alt="Illustration d'une agence immobilière"
            width={600}
            height={600}
            className="w-full max-w-lg h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* Footer (placeholder for now) */}
      <footer className="py-6 flex flex-wrap items-center justify-center text-gray-200 font-medium text-sm bg-primary-900">
        © {new Date().getFullYear()} Livora — Tous droits réservés
      </footer>
    </main>
  );
}
