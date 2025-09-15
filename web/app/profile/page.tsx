'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { logout } from '@/src/lib/auth';
import { withAuth } from '@/src/lib/withAuth';
import { useRouter } from 'next/navigation';

function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You are not logged in.</p>;

  async function handleLogout() {
    await logout();
    router.push('/auth/login');
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Profile</h1>
      <p>
        Welcome, {user.name} ({user.email})
      </p>
      <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded mt-4">
        Logout
      </button>
    </main>
  );
}

export default withAuth(ProfilePage);
