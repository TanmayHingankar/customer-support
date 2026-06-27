export const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

export function apiUrl(path: string) {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with a leading slash');
  }
  return API_BASE ? `${API_BASE}${path}` : path;
}
