const rawBasePath = import.meta.env.BASE_URL;

export const basePath = rawBasePath.endsWith("/")
  ? rawBasePath
  : `${rawBasePath}/`;

export const withBase = (path = "") => {
  const cleanedPath = path.replace(/^\/+/, "");
  return `${basePath}${cleanedPath}`;
};

export const isBasePath = (pathname: string) => {
  const baseWithoutTrailingSlash = basePath.replace(/\/$/, "");
  return pathname === basePath || pathname === baseWithoutTrailingSlash;
};

export const getHostname = (url: string) =>
  new URL(url).hostname.replace(/^www\./, "");

export const isExternalUrl = (url: string) => /^https?:\/\//.test(url);
