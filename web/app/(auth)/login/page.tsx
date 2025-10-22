'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { ok, user, error } = await api.post('/auth/login', { email, password });
      if (!ok) throw new Error(error);

      setUser(user);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GENERAL_ERROR');
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="bg-secondary-500 text-white py-3 rounded-md font-semibold hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('login')}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-2 text-sm rounded-sm bg-red-50/50 border border-red-100 px-3 py-2 text-red-600"
        >
          <p>{t(`errors.${error}`)}</p>

          {error === 'EMAIL_NOT_VERIFIED' && (
            <p className="mt-1 text-gray-600">
              <a
                href="/resend-verification"
                className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
              >
                {t('verify.error.resend_verification')}
              </a>
            </p>
          )}
        </div>
      )}

      <p className="text-gray-500 text-sm mt-2">
        {t('no_account')}{' '}
        <Link href="/register" className="text-secondary-500 font-medium hover:underline">
          {t('register')}
        </Link>
      </p>

      <p className="text-gray-500 text-sm mt-1">
        <Link href="/forgot-password" className="text-secondary-500 hover:underline">
          {t('forgot_password')}
        </Link>
      </p>
    </div>
  );
}
