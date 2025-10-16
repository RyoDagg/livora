'use client';
import Loader from '@/src/components/Loader';
import { useAuth } from '@/src/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <main className="min-h-screen lg:min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Left / Form Section */}
      <section className="flex flex-col justify-center p-6 w-full max-w-md mx-auto space-y-6">
        {children}
      </section>

      {/* Right / Illustration Section */}
      <section className="relative hidden lg:flex justify-center bg-gray-100">
        <Image src="/hero-bg.png" alt="Auth Illustration" fill className="object-cover" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="z-50 mt-40 px-24 text-center md:text-left max-w-3xl space-y-4">
          <p className="text-3xl font-bold text-secondary-500">Livora</p>

          <h1 className="text-3xl md:text-5xl leading-tight text-gray-100 capitalize">
            Découvrez <span className="font-bold italic">gratuitement</span> les meilleures offres
            immobilières.
          </h1>

          <p className="text-xl text-gray-200">
            Parcourez et publiez annonces immobilières en toute simplicité.
          </p>
        </div>
      </section>
    </main>
  );
}
