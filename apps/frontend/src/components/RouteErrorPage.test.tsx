import { createMemoryRouter, RouterProvider } from "react-router";

import { describe, expect, it, vi } from "vitest";

import { formatRouteError, RouteErrorPage } from "./RouteErrorPage.tsx";
import { render, screen } from "~/test/render.tsx";

describe("RouteErrorPage", () => {
  it("includes the original exception, stack and application metadata", () => {
    const error = new TypeError(
      "Cannot read properties of null (reading 'id')",
    );
    error.stack =
      "TypeError: Cannot read properties of null\n    at mapGuestWarband (guest-roster.mapper.ts:14:12)";

    const diagnostics = formatRouteError(
      error,
      "/armies/rosters/guest",
      "2.0.0-alpha.25",
      {
        browser: "Chrome 151.0.0.0",
        operatingSystem: "Linux",
        language: "en-GB",
        viewport: "1366 x 768",
        timestamp: "2026-10-26T20:54:00.000Z",
      },
      "2026-10-26T18:00:00.000Z",
    );

    expect(diagnostics).toContain("Application version: 2.0.0-alpha.25");
    expect(diagnostics).toContain("Route: /armies/rosters/guest");
    expect(diagnostics).toContain("Build date: 2026-10-26T18:00:00.000Z");
    expect(diagnostics).toContain("Browser: Chrome 151.0.0.0");
    expect(diagnostics).toContain("Operating system: Linux");
    expect(diagnostics).toContain("Language: en-GB");
    expect(diagnostics).toContain("Viewport: 1366 x 768");
    expect(diagnostics).toContain("Reported at: 2026-10-26T20:54:00.000Z");
    expect(diagnostics).toContain(
      "mapGuestWarband (guest-roster.mapper.ts:14:12)",
    );
    expect(diagnostics).not.toContain("?token=");
  });

  it("shows a generic recovery page with collapsible diagnostics", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    function BrokenPage(): never {
      throw new Error("Unexpected rendering error");
    }

    const router = createMemoryRouter(
      [
        {
          path: "/armies/rosters/guest",
          element: <BrokenPage />,
          errorElement: <RouteErrorPage />,
        },
      ],
      { initialEntries: ["/armies/rosters/guest"] },
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.getByRole("heading", { name: "We couldn't display this page" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Technical details")).toBeInTheDocument();
    expect(screen.getByText(/Unexpected rendering error/)).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
