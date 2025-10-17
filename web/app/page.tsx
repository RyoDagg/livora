import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section
        className="relative bg-primary-900 shadow-lg text-white py-28 h-[calc(100vh-4rem)]"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-7xl mx-auto flex items-center px-6 md:px-12 py-24 gap-16">
          {/* Left Content */}
          <div className="text-center w-full md:text-left max-w-md md:max-w-2xl space-y-6">
            <p className="text-3xl font-bold text-secondary-500">Livora</p>

            <h1 className="text-3xl md:text-5xl leading-tight text-gray-100 capitalize">
              {t('hero.title.part1')}{' '}
              <span className="font-bold italic">{t('hero.title.highlight')}</span>{' '}
              {t('hero.title.part2')}
            </h1>

            <p className="text-xl text-gray-200">{t('hero.subtitle')}</p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/listings"
                className="px-6 py-3 bg-secondary-500 text-white font-semibold text-lg shadow hover:bg-secondary-400 transition"
              >
                {t('hero.cta')}
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden max-w-xl justify-center w-full lg:block">
            <Image
              src="/hero-image.png"
              alt={t('hero.image_alt')}
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
        <div className="text-center md:text-left space-y-6 mx-auto max-w-xl">
          <h2 className="text-3xl lg:text-5xl font-semibold text-gray-800 capitalize">
            {t('agencies.title')}
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            {t('agencies.description.part1')}{' '}
            <span className="font-extrabold text-secondary-500">
              {t('agencies.description.highlight1')}
            </span>
            . {t('agencies.description.part2')}{' '}
            <span className="font-extrabold text-secondary-500">
              {t('agencies.description.highlight2')}
            </span>
            , {t('agencies.description.part3')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/listings/create"
              className="px-6 py-3 bg-primary-800 text-white font-semibold text-lg shadow hover:bg-primary-700 transition-colors duration-200"
            >
              {t('agencies.cta')}
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/deal.png"
            alt={t('agencies.image_alt')}
            width={600}
            height={600}
            className="w-full max-w-lg h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 flex flex-wrap items-center justify-center text-gray-200 font-medium text-sm bg-primary-900">
        © {new Date().getFullYear()} Livora — {t('footer.rights')}
      </footer>
    </main>
  );
}
