'use client';

import { useEffect, useState } from 'react';
import { User } from '../types/User';
import { useAuthStore } from '../lib/store';
import { api } from '../lib/api';

export function useAuth(): { user: User | null; loading: boolean } {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await api.get('/users/me');
        setUser(user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { user, loading };
}
