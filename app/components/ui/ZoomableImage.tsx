"use client";

import Image from "next/image";
import { useRef } from "react";
import CloseButton from "./CloseButton";

type ZoomableImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  /** Classes for the thumbnail image itself. */
  className?: string;
  /** Classes for the aspect-ratio box around the thumbnail. */
  frameClassName?: string;
  /** Accessible name for the trigger; defaults to English if omitted. */
  enlargeLabel?: string;
  /** Accessible name for the cross; defaults to English if omitted. */
  closeLabel?: string;
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
  enlargeLabel = "Enlarge photo",
  closeLabel = "Close",
}: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`${enlargeLabel}: ${alt}`}
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
        {/* Clicking anywhere already closes this, but on a phone that is a
            guess rather than an affordance. */}
        <CloseButton
          onClick={() => dialogRef.current?.close()}
          label={closeLabel}
          className="absolute right-4 top-4 z-10"
        />

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
