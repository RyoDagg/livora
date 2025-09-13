"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !user) {
        router.replace(
          `/auth/login?redirectTo=${encodeURIComponent(pathname)}`
        );
      }
    }, [loading, user, router]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null; // don’t flash page before redirect

    return <Component {...props} />;
  };
}
