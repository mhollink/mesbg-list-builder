import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ProfileStats } from "./ProfileStats.tsx";

describe("ProfileStats", () => {
  test("renders warrior stats", () => {
    render(
      <ProfileStats
        stats={{
          type: "warrior",
          mv: "6″",
          fv: "4",
          sv: "4+",
          s: "4",
          d: "5",
          a: "2",
          w: "2",
          c: "7+",
          i: "8+",
        }}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Mv" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Fv" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Might" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Will" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Fate" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("6″")).toBeInTheDocument();
  });

  test("renders siege stats", () => {
    render(
      <ProfileStats
        stats={{
          type: "siege",
          range: "48″",
          s: "9",
          d: "10",
          w: "4",
        }}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Range" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Strength" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Defence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Wounds" }),
    ).toBeInTheDocument();
    expect(screen.getByText("48″")).toBeInTheDocument();
  });

  test("renders heroic stats", () => {
    render(
      <ProfileStats
        stats={{
          type: "hero",
          mv: "6″",
          fv: "6",
          sv: "3+",
          s: "4",
          d: "7",
          a: "3",
          w: "3",
          c: "5+",
          i: "6+",
          might: "3",
          will: "3",
          fate: "3",
        }}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Might" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Will" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Fate" }),
    ).toBeInTheDocument();
  });
});
