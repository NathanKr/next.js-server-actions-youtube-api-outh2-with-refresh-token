export function concatUrls(baseUrl: string, relativeUrl: string): string {
  return new URL(relativeUrl, baseUrl).href;
}
