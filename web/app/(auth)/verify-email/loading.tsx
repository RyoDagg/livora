import Loader from '@/src/components/Loader';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('user.verify');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <p className="text-2xl font-semibold text-primary-500">{t('verifying')}</p>
      <Loader />
    </div>
  );
}
