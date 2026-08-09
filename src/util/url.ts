export const getHostname = (url: string) =>
  new URL(url).hostname.replace(/^www\./, "");

export const isExternalUrl = (url: string) => /^https?:\/\//.test(url);
