// API helper for internal API calls within the same Next.js application
// Always use relative paths - works both locally and on Vercel production
export function apiUrl(path: string) {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with a leading slash');
  }
  // Always return relative path for internal API calls
  // This works in both local development and Vercel production
  return path;
}

