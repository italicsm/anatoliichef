import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/**
 * Uploads go through the service role key, like every other write. The bucket
 * is public for reads, so the stored value is a plain URL that next/image can
 * optimise without signing anything.
 */

const BUCKET = "menu";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_BYTES = 8 * 1024 * 1024;

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до сховища: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

function publicUrl(path: string): string {
  const base = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Returns null when the field was left empty, so callers can treat it as "no change". */
export async function uploadImage(
  file: File | null,
  folder: string
): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = ALLOWED_TYPES[file.type];

  if (!extension) {
    throw new AdminError(
      "Підтримуються лише JPG, PNG, WebP і AVIF."
    );
  }

  if (file.size > MAX_BYTES) {
    throw new AdminError(
      `Файл завеликий: ${(file.size / 1024 / 1024).toFixed(1)} МБ, максимум 8 МБ.`
    );
  }

  // Random name: the original may be Cyrillic, contain spaces, or collide with
  // an existing file, and none of that is worth handling.
  const name = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extension}`;

  const path = `${folder}/${name}`;

  const { error } = await requireClient()
    .storage.from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new AdminError(`Не вдалося завантажити файл: ${error.message}`);
  }

  return publicUrl(path);
}

/**
 * Removes a file previously produced by uploadImage. Paths that do not belong
 * to our bucket — the seeded photos under /photo — are ignored rather than
 * treated as an error, so replacing a legacy image just drops the reference.
 */
export async function deleteImage(url: string | null): Promise<void> {
  if (!url) {
    return;
  }

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return;
  }

  const path = url.slice(index + marker.length);

  const { error } = await requireClient().storage.from(BUCKET).remove([path]);

  if (error) {
    // A missing file must not block the database update that follows.
    console.error("[admin] could not delete the stored file", error);
  }
}
