/**
 * Centralized API configuration for VeriSign AI
 * Defaults to relative paths (/api/...) on Vercel or when NEXT_PUBLIC_API_URL is not set.
 */
export function getApiUrl(endpoint: string = ""): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return cleanBase ? `${cleanBase}${cleanEndpoint}` : cleanEndpoint;
}
