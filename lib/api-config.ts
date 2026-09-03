/**
 * Centralized API configuration for VeriSign AI Backend
 */
export function getApiUrl(endpoint: string = ""): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return endpoint ? `${cleanBase}${cleanEndpoint}` : cleanBase;
}
