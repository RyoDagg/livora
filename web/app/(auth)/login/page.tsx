'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAuthStore } from '@/src/lib/store';
import { api } from '@/src/lib/api';

export default function LoginPage() {
  const t = useTranslations('user');
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setUser } = useAuthStore();

  const redirect = searchParams.get('redirectTo') || '/listings';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { ok, user } = await api.post('/auth/login', { email, password });
      if (!ok) throw new Error('Login failed');

      setUser(user);
      router.push(redirect);
    } catch (err) {
      console.error('Error during login', err);
      setError('Login failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-gray-800">{t('login')}</h1>
        <p className="text-gray-500 mt-1">{t('login_title')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
          required
        />
        <input
          type="password"
          placeholder={t('fields.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
          required
        />
        <button
          type="submit"
          className="bg-secondary-500 text-white py-3 rounded-md font-semibold hover:bg-secondary-600 transition-colors"
        >
          {t('login')}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2 animate-pulse">{error}</p>}

      <p className="text-gray-500 text-sm mt-2">
        {t('no_account')}{' '}
        <a href="/register" className="text-secondary-500 font-medium hover:underline">
          {t('register')}
        </a>
      </p>

      <p className="text-gray-500 text-sm mt-1">
        <a href="/forgot-password" className="text-secondary-500 hover:underline">
          {t('forgot_password')}
        </a>
      </p>
    </div>
  );
}
