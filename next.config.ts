import type { NextConfig } from "next";

/**
 * next/image refuses remote hosts it was not told about, and the failure is
 * silent-ish: the upload succeeds, the row is written, and only the thumbnail
 * is missing.
 *
 * The hostname is a wildcard rather than a value read from SUPABASE_URL on
 * purpose. Config evaluation and env loading are two different moments, and a
 * pattern that depends on the second one turns a missing variable into a
 * broken image instead of an error. The path is still pinned to the public
 * storage endpoint, so this allows exactly what it should.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
