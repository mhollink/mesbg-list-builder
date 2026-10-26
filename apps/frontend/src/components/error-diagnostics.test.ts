import { describe, expect, it } from "vitest";

import {
  describeBrowser,
  describeOperatingSystem,
} from "./error-diagnostics.ts";

describe("browser diagnostics", () => {
  it.each([
    ["Mozilla/5.0 Chrome/151.0.0.0 Safari/537.36", "Chrome 151.0.0.0"],
    ["Mozilla/5.0 Chrome/151.0.0.0 Edg/151.0.0.0", "Edge 151.0.0.0"],
    ["Mozilla/5.0 Chrome/151.0.0.0 OPR/116.0.0.0", "Opera 116.0.0.0"],
    ["Mozilla/5.0 Firefox/144.0", "Firefox 144.0"],
    ["Mozilla/5.0 Version/26.0 Safari/605.1.15", "Safari 26.0"],
    ["", "Unknown"],
  ])("detects the browser from %s", (userAgent, expected) => {
    expect(describeBrowser(userAgent)).toBe(expected);
  });

  it.each([
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Windows"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "macOS"],
    ["Mozilla/5.0 (Linux; Android 15; Pixel 9)", "Android"],
    ["Mozilla/5.0 (X11; CrOS x86_64 16093.68.0)", "ChromeOS"],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", "iOS / iPadOS"],
    ["Mozilla/5.0 (X11; Linux x86_64)", "Linux"],
    ["", "Unknown"],
  ])("detects the operating system from %s", (userAgent, expected) => {
    expect(describeOperatingSystem(userAgent)).toBe(expected);
  });
});
