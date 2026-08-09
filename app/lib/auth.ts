/**
 * One administrator, no user table.
 *
 * The session is a signed cookie: `<expiry>.<hmac>`. Nothing is stored server
 * side, so there is nothing to leak and nothing to clean up. Revoking every
 * session means changing ADMIN_SESSION_SECRET.
 *
 * Built on Web Crypto rather than node:crypto so the very same functions run
 * inside middleware, which may execute on the edge runtime.
 */

export const SESSION_COOKIE = "admin_session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? null;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Comparison that does not leak how many characters matched. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return difference === 0;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return false;
  }

  // Hashing both sides first keeps the comparison length-independent, so a
  // wrong password of a different length cannot be told apart by timing.
  const [left, right] = await Promise.all([
    sign(candidate, "password-compare"),
    sign(expected, "password-compare"),
  ]);

  return safeEqual(left, right);
}

export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret();

  if (!secret) {
    return null;
  }

  const expiry = String(Date.now() + SESSION_DURATION_MS);

  return `${expiry}.${await sign(expiry, secret)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  const secret = getSecret();

  if (!token || !secret) {
    return false;
  }

  const separator = token.lastIndexOf(".");

  if (separator === -1) {
    return false;
  }

  const expiry = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!safeEqual(signature, await sign(expiry, secret))) {
    return false;
  }

  const expiresAt = Number(expiry);

  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
