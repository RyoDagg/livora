'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { BiZoomIn } from 'react-icons/bi';

export default function ImagesSection({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 w-full overflow-hidden border-2 border-gray-200">
        <Image src="/listing-placeholder.png" alt={title} fill className="object-cover" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-2">
        {/* Main Image */}
        <div
          className="relative h-96 w-full cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition group"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm md:text-base font-medium">
              <BiZoomIn className="inline text-2xl mr-2" />
              Click to Zoom
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1).map((img, i) => (
            <div
              key={i}
              className="relative h-32 w-full cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition group"
              onClick={() => setSelectedIndex(i + 1)}
            >
              <Image
                src={img}
                alt={`${title} ${i}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs md:text-sm font-medium">
                  <BiZoomIn className="inline text-2xl mr-2" />
                  Click to Zoom
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-11/12 md:w-3/4 lg:w-1/2 aspect-[4/3] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-10 text-white text-3xl hover:text-gray-300"
            >
              &times;
            </button>

            {/* Prev button */}
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white text-4xl mx-5 rounded-full bg-gray-800 border border-gray-800 opacity-50 hover:opacity-80"
            >
              <FaCircleChevronLeft />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white text-4xl mx-5 rounded-full bg-gray-800 border border-gray-800 opacity-50 hover:opacity-80"
            >
              <FaCircleChevronRight />
            </button>

            {/* Selected Image */}
            <div key={images[selectedIndex]} className="relative w-full h-full">
              <Image
                src={images[selectedIndex]}
                alt={`${title} enlarged`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
