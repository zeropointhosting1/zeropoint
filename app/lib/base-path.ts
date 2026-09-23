// Mirrors next.config.ts's basePath, inlined into the client bundle via
// NEXT_PUBLIC_BASE_PATH (see next.config.ts). Use this for any local
// public/ asset path that isn't already passed through next/link, since
// next/link prefixes basePath automatically but next/image and plain
// src="/..." strings don't.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
