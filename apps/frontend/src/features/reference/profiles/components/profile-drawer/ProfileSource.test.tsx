import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { ProfileSource } from "./ProfileSource.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => `book:${key}`,
  }),
}));

describe("ProfileSource", () => {
  test("renders the translated source and page", () => {
    render(
      <ProfileSource
        source={{
          book: "armies-of-the-lord-of-the-rings",
          page: 42,
        }}
      />,
    );

    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(
      screen.getByText("book:armies-of-the-lord-of-the-rings (page 42)"),
    ).toBeInTheDocument();
  });
});
