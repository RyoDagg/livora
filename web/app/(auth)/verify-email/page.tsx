import { api } from '@/src/lib/api';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const t = await getTranslations('user.verify');
  const { token = '' } = await searchParams;

  const { ok } = await api.get(`/auth/verify?token=${token}`);

  if (ok) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-3xl font-semibold text-green-600">{t('success.title')}</p>
        <p className="text-gray-600">{t('success.message')}</p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-sm hover:bg-primary-600 transition"
        >
          {t('success.login')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <p className="text-3xl font-semibold text-red-600">{t('error.title')}</p>
      <p className="text-gray-600">{t('error.message')}</p>

      <Link
        href="/resend-verification"
        className="px-5 py-2.5 bg-secondary-500 text-white font-medium rounded-sm hover:bg-secondary-600 transition"
      >
        {t('error.resend_verification')}
      </Link>

      <Link
        href="/register"
        className="px-5 py-2.5 border border-primary-500 text-primary-500 font-medium rounded-sm hover:bg-primary-50 transition"
      >
        {t('error.register')}
      </Link>
    </div>
  );
}
