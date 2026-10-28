/** Only same-site paths may be used as a post-login destination. */
export function safeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return "/dashboard";
  try {
    const url = new URL(value, "https://acm.invalid");
    return url.origin === "https://acm.invalid" ? `${url.pathname}${url.search}${url.hash}` : "/dashboard";
  } catch { return "/dashboard"; }
}
