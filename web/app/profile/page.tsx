'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { api } from '@/src/lib/api';
import { withAuth } from '@/src/lib/withAuth';
import Image from 'next/image';
import { useAuthStore } from '@/src/lib/store';
import { toast } from 'react-hot-toast';
import Loader from '@/src/components/Loader';

function ProfilePage() {
  const { user, loading } = useAuth();
  const { setUser } = useAuthStore();
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: '',
    bio: '',
    gender: '',
    phone: '',
    address: '',
    state: '',
    avatarUrl: '',
    isCompany: false,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        gender: user.gender || '',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        avatarUrl: user.avatarUrl || '',
        isCompany: user.isCompany || false,
      });
    }
  }, [user]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const { url } = await api.upload('/files/upload', formData);
      setForm({ ...form, avatarUrl: url });
      toast.success('Image téléchargée avec succès !');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du téléchargement de l'image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setUpdating(true);
      const { ok, data } = await api.put('/users/me', form);
      if (!ok) throw new Error('Échec de la mise à jour');
      setUser(data);
      toast.success('Profil mis à jour avec succès !');
    } catch (err) {
      console.error(err);
      toast.error('Une erreur est survenue.');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="text-center py-12 text-gray-500">Chargement...</p>;
  if (!user)
    return <p className="text-center py-12 text-gray-500">Vous n&apos;êtes pas connecté.</p>;

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 sm:px-8">
      {/* Header */}
      <div className="items-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mon Profil</h1>
        {user.lastLogin && (
          <p className="text-gray-500 text-sm">
            Dernière connexion :{' '}
            {new Date(user.lastLogin).toLocaleString('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 px-4 lg:px-0">
        {/* Avatar Upload */}
        <div className="space-y-2">
          <div className="relative w-32 h-32">
            <Image
              src={form.avatarUrl || '/default-avatar.png'}
              alt="Avatar"
              width={112}
              height={112}
              className="rounded-full w-32 h-32 border-2 border-gray-300 shadow-sm object-cover"
            />
            {!uploadingImage && (
              <label
                aria-label="Changer l'image de profil"
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-sm font-medium"
              >
                Changer
              </label>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <Loader />
              </div>
            )}
          </div>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploadingImage}
          />
        </div>
        {/* Inputs */}
        <div className="grid lg:grid-cols-2 gap-x-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              />
            </div>

            {/* Toggle */}
            <label
              onClick={() => setForm({ ...form, isCompany: !form.isCompany })}
              className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">Je suis une entreprise</span>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isCompany ? 'bg-secondary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isCompany ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary-500 resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Adresse</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Région</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Genre</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="mt-2 ml-auto bg-secondary-500 text-white px-4 py-3 rounded-md font-semibold hover:bg-secondary-600 transition disabled:opacity-60"
          >
            {updating ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default withAuth(ProfilePage);
