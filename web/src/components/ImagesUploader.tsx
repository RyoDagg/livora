import { useState } from 'react';
import Image from 'next/image';
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Loader from './Loader';
import { ListingInput } from '../types/Listing';
import { api } from '../lib/api';

type ImagesUploaderProps = {
  form: ListingInput;
  setForm: (form: ListingInput) => void;
};

export default function ImagesUploader({ form, setForm }: ImagesUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = form.imagesURL.indexOf(active.id as string);
    const newIndex = form.imagesURL.indexOf(over.id as string);

    setForm({
      ...form,
      imagesURL: arrayMove(form.imagesURL, oldIndex, newIndex),
    });
  };

  return (
    <div>
      <input
        id="image"
        type="file"
        accept="image/*"
        hidden
        disabled={uploading}
        onChange={handleUpload}
      />

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={form.imagesURL} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap items-center gap-4 p-4 rounded bg-gray-100">
            {form.imagesURL.map((url) => (
              <SortableImage key={url} url={url} onDelete={() => handleDelete(url)} />
            ))}

            {/* Upload slot */}
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
        </SortableContext>

        {/* 🔲 Drag overlay for visual empty slot */}
        <DragOverlay>
          {activeId ? (
            <div className="h-28 w-28 border-2 border-dashed border-gray-400 rounded-md opacity-50 bg-gray-200" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableImage({ url, onDelete }: { url: string; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative group hover:shadow-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 bg-white/80 hover:bg-red-50 rounded-full text-red-500 text-xl font-bold px-2 transition-opacity opacity-0 group-hover:opacity-100"
        title="Supprimer"
      >
        ×
      </button>
      <Image
        {...listeners}
        src={url}
        width={160}
        height={160}
        alt="Uploaded"
        className="h-28 w-28 object-cover rounded-md shadow border border-gray-200"
      />
    </div>
  );
}
