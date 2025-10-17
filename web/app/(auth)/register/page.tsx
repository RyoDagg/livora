'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { api } from '@/src/lib/api';
import { useAuthStore } from '@/src/lib/store';

export default function RegisterPage() {
  const t = useTranslations('user');
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { ok, user } = await api.post('/auth/register', {
        email,
        password,
        name,
        isCompany,
      });
      if (!ok) throw new Error('Registration failed');

      setUser(user);
      router.push('/listings');
    } catch (err) {
      console.error('Error during registration', err);
      setError('Registration failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-gray-800">{t('register')}</h1>
        <p className="text-gray-500 mt-1">{t('register_title')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={t('fields.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
          required
        />
        <input
          type="password"
          placeholder={t('fields.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
          required
        />

        {/* isCompany Toggle */}
        <label
          onClick={() => setIsCompany(!isCompany)}
          className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-gray-700 font-medium">{t('fields.isCompany')}</span>
          <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isCompany ? 'bg-secondary-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isCompany ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </label>

        <button
          type="submit"
          className="bg-secondary-500 text-white py-3 rounded-md font-semibold hover:bg-secondary-600 transition-colors"
        >
          {t('register')}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2 animate-pulse">{error}</p>}

      <p className="text-gray-500 text-sm mt-2">
        {t('register_has_account')}{' '}
        <a href="/login" className="text-secondary-500 font-medium hover:underline">
          {t('login')}
        </a>
      </p>
    </div>
  );
}
