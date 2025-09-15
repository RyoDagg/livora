'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/src/lib/auth';
import { useAuthStore } from '@/src/lib/store';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirect = searchParams.get('redirectTo') || '/listings'; // Todo: replace default redirect with Dashboard when ready

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { ok, user } = await login(email, password);
      if (!ok) throw new Error('Login failed');

      setUser(user);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </main>
  );
}
