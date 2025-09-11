"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (user) {
    router.push("/profile");
    return null;
  }

  return <>{children}</>;
}
