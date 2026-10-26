/**
 * Browser diagnostics are intentionally coarse and collected only for display.
 * In particular, we do not include the full user agent, cookies or the URL query.
 */
export interface BrowserDiagnostics {
  browser: string;
  operatingSystem: string;
  language: string;
  viewport: string;
  timestamp: string;
}

export function describeBrowser(userAgent: string): string {
  // Order matters: Chromium-based browsers also include Chrome in their UA.
  const browsers: ReadonlyArray<readonly [string, RegExp]> = [
    ["Edge", /(?:Edg|EdgA|EdgiOS)\/([\d.]+)/],
    ["Opera", /(?:OPR|OPiOS)\/([\d.]+)/],
    ["Samsung Internet", /SamsungBrowser\/([\d.]+)/],
    ["Firefox", /(?:Firefox|FxiOS)\/([\d.]+)/],
    ["Chrome", /(?:Chrome|CriOS)\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari/],
  ];

  for (const [name, pattern] of browsers) {
    const match = userAgent.match(pattern);
    if (match) {
      return `${name} ${match[1]}`;
    }
  }

  return "Unknown";
}

export function describeOperatingSystem(userAgent: string): string {
  if (/CrOS/i.test(userAgent)) return "ChromeOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPad|iPhone|iPod/i.test(userAgent)) return "iOS / iPadOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

export function collectBrowserDiagnostics(): BrowserDiagnostics {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

  return {
    browser: describeBrowser(userAgent),
    operatingSystem: describeOperatingSystem(userAgent),
    language:
      typeof navigator !== "undefined"
        ? navigator.language || "Unknown"
        : "Unknown",
    viewport:
      typeof window !== "undefined"
        ? `${window.innerWidth} x ${window.innerHeight}`
        : "Unknown",
    timestamp: new Date().toISOString(),
  };
}
