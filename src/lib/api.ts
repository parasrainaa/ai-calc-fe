const PRODUCTION_API_URL = "https://ai-calc-backend-bun.parasraina-33.workers.dev";
const LOCAL_API_URL = "http://localhost:3000";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl && isAbsoluteUrl(configuredUrl)) {
    return trimTrailingSlash(configuredUrl);
  }

  if (
    typeof window !== "undefined" &&
    LOCAL_HOSTS.has(window.location.hostname)
  ) {
    return LOCAL_API_URL;
  }

  return PRODUCTION_API_URL;
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
};
