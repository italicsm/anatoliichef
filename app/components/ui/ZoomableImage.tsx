"use client";

import Image from "next/image";
import { useRef } from "react";

type ZoomableImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  /** Classes for the thumbnail image itself. */
  className?: string;
  /** Classes for the aspect-ratio box around the thumbnail. */
  frameClassName?: string;
};

/**
 * Opens the photo full size in a native <dialog>, which gives Esc to close,
 * focus containment and an inert background without any library.
 */
export default function ZoomableImage({
  src,
  alt,
  sizes,
  className = "",
  frameClassName = "",
}: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Enlarge photo: ${alt}`}
        className={`relative block w-full cursor-zoom-in overflow-hidden ${frameClassName}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          className={className}
        />
      </button>

      <dialog
        ref={dialogRef}
        onClick={() => dialogRef.current?.close()}
        className="zoom-dialog fixed inset-0 m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-white/70"
      >
        <div className="relative h-[62svh] w-[88vw] cursor-zoom-out sm:w-[46vw]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 46vw, 88vw"
            quality={100}
            className="object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
