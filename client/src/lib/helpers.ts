export const copyText = (payload: string | object) => function () {
  const val: string = typeof payload === "string"
    ? payload
    : JSON.stringify(payload)
  navigator.clipboard.writeText(val);
}

export const buildUrlWithQueryParams = function (
  url: string,
  params: Record<string, string | number> = {},
) {
  const query = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
};

export const ensureProtocol = function (protocol: "http" | "https", str: string) {
  return str.startsWith("http") ? str : `${protocol}://${str}`;
}