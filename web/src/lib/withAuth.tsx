'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !user) {
        router.replace(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
      }
    }, [loading, user, router]);

    if (loading)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      );
    if (!user) return null; // don’t flash page before redirect

    return <Component {...props} />;
  };
}
