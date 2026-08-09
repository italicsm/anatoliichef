"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { adminLabelStyles } from "./AdminField";

type ImageFieldProps = {
  label: string;
  name: string;
  currentUrl?: string | null;
  /** Name of the checkbox that clears the current image. */
  removeName?: string;
  hint?: string;
};

/**
 * Shows what is stored now, and what is about to replace it.
 *
 * The preview comes from the file itself through an object URL, so the chef
 * sees the picture before it is uploaded rather than after — waiting for a
 * round trip to find out the wrong file was picked is the slowest way to
 * discover it. Object URLs are revoked on change and on unmount; they hold the
 * file in memory until released.
 */
export default function ImageField({
  label,
  name,
  currentUrl,
  removeName,
  hint,
}: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    setPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : null;
    });

    setFileName(file?.name ?? null);
  }

  return (
    <div>
      <span className={adminLabelStyles}>{label}</span>

      <div className="mt-3 flex flex-wrap items-start gap-6">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-zinc-100">
          {preview ? (
            // A blob: URL cannot go through the image optimiser.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : currentUrl ? (
            <Image
              src={currentUrl}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-zinc-400">
              немає
            </span>
          )}
        </div>

        <div className="flex-1">
          <input
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleChange}
            className="block w-full text-sm text-zinc-600 file:mr-4 file:border file:border-zinc-300 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.2em] file:text-zinc-700 hover:file:border-zinc-900"
          />

          {preview ? (
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-700">
              обрано: {fileName}
            </p>
          ) : null}

          <p className="mt-3 text-xs text-zinc-400">
            {hint ?? "JPG, PNG, WebP або AVIF, до 8 МБ."}
          </p>

          {currentUrl && removeName ? (
            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                name={removeName}
                className="h-4 w-4 accent-zinc-900"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Прибрати поточне фото
              </span>
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}
