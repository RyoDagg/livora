'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';

import { api } from '@/src/lib/api';

export default function ResendVerificationPage() {
  const t = useTranslations('user');

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const { ok, error } = await api.post('/auth/resend-verification', { email });

      if (!ok) throw new Error(error);

      toast.success(t('verify.resend_verification.success_message'));
      setSuccess(true);
    } catch (err) {
      toast.error(t('verify.resend_verification.errors.request_failed'));
      setError(err instanceof Error ? err.message : 'request_failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium text-gray-800">
            {t('verify.resend_verification.title')}
          </h1>
          <p className="text-gray-500 mt-1">{t('verify.resend_verification.subtitle')}</p>
        </div>

        <div
          role="alert"
          className="mt-2 text-lg rounded-sm bg-green-50/50 border border-green-200 px-3 py-2 text-green-600"
        >
          <p>{t('verify.resend_verification.success_message')}</p>
        </div>

        <Link
          href="/login"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          {t('login')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-gray-800">
          {t('verify.resend_verification.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('verify.resend_verification.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t('verify.resend_verification.sending')
            : t('verify.resend_verification.submit')}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-2 text-sm rounded-sm bg-red-50/50 border border-red-100 px-3 py-2 text-red-600"
        >
          <p>{t(`errors.${error}`)}</p>
        </div>
      )}

      <p className="text-gray-500 text-sm mt-2">
        {t('no_account')}{' '}
        <Link href="/register" className="text-secondary-500 font-medium hover:underline">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
