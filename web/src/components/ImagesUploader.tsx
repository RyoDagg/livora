import { useState } from 'react';
import Image from 'next/image';

import Loader from './Loader';

import { ListingInput } from '../types/Listing';
import { api } from '../lib/api';

type ImagesUploaderProps = {
  form: ListingInput;
  setForm: (form: ListingInput) => void;
};

export default function ImagesUploader({ form, setForm }: ImagesUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const { url } = await api.upload('/files/upload', formData);

      setForm({ ...form, imagesURL: [...form.imagesURL, url] });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  const handleDelete = (url: string) => {
    setForm({
      ...form,
      imagesURL: form.imagesURL.filter((imageUrl) => imageUrl !== url),
    });
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        id="image"
        type="file"
        accept="image/*"
        hidden
        disabled={uploading}
        onChange={handleUpload}
      />

      <div className="flex flex-wrap items-center gap-4 p-4 rounded bg-gray-100">
        {form.imagesURL.map((url) => (
          <div key={url} className="relative group">
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-1 right-1 bg-white/80 hover:bg-red-50 rounded-full text-red-500 text-xl font-bold px-2 transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Supprimer"
            >
              ×
            </button>
            <Image
              src={url}
              width={160}
              height={160}
              alt="Uploaded"
              className="h-28 w-auto max-w-40 object-contain rounded-md shadow border border-gray-200"
            />
          </div>
        ))}

        {/* Upload button or loader */}
        {uploading ? (
          <div className="flex justify-center items-center h-28 w-28 bg-gray-200 rounded-md">
            <Loader />
          </div>
        ) : (
          <label
            htmlFor="image"
            className="h-28 w-28 flex justify-center items-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-black/15 transition"
          >
            <Image
              src="/images-plus.png"
              width={100}
              height={100}
              alt="Add"
              className="opacity-70 group-hover:opacity-100"
            />
          </label>
        )}
      </div>
    </div>
  );
}
