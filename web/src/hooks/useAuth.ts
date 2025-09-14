"use client";

import { useEffect, useState } from "react";
import { me } from "@/src/lib/auth";
import { User } from "../types/User";
import { useAuthStore } from "../lib/store";

export function useAuth(): { user: User | null; loading: boolean } {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
