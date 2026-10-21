import type { UIEvent } from "react";

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDrawerScrollRestoration } from "./useDrawerScrollRestoration.ts";

const router = vi.hoisted(() => ({ key: "profile-a" }));

vi.mock("react-router", () => ({
  useLocation: () => ({ key: router.key }),
}));

function paperElement() {
  const paper = document.createElement("div");
  Object.defineProperty(paper, "scrollTo", {
    value: vi.fn((options: ScrollToOptions) => {
      paper.scrollTop = options.top ?? 0;
    }),
  });
  return paper;
}

function scroll(
  onScroll: (event: UIEvent<HTMLDivElement>) => void,
  paper: HTMLDivElement,
  top: number,
) {
  paper.scrollTop = top;
  act(() => onScroll({ currentTarget: paper } as UIEvent<HTMLDivElement>));
}

describe("useDrawerScrollRestoration", () => {
  beforeEach(() => {
    router.key = "profile-a";
  });

  it("starts new entries at the top and restores previous profile positions", () => {
    const positions = new Map<string, number>();
    const { result, rerender } = renderHook(() =>
      useDrawerScrollRestoration(true, positions),
    );
    const paper = paperElement();
    result.current.paperRef.current = paper;

    act(() => {
      result.current.onEnter();
      result.current.onEntered();
    });
    scroll(result.current.onScroll, paper, 420);
    expect(positions.get("profile-a")).toBe(420);

    router.key = "profile-b";
    rerender();
    expect(paper.scrollTop).toBe(0);
    scroll(result.current.onScroll, paper, 180);

    router.key = "profile-a";
    rerender();
    expect(paper.scrollTop).toBe(420);
    expect(paper.scrollTo).toHaveBeenLastCalledWith({
      top: 420,
      behavior: "instant",
    });
    expect(positions.get("profile-b")).toBe(180);
  });

  it("restores the profile after visiting a separate rule drawer", () => {
    const positions = new Map<string, number>();
    const { result, rerender } = renderHook(
      ({ active }: { active: "profile" | "rule" }) => ({
        profile: useDrawerScrollRestoration(active === "profile", positions),
        rule: useDrawerScrollRestoration(active === "rule", positions),
      }),
      { initialProps: { active: "profile" as "profile" | "rule" } },
    );
    const profilePaper = paperElement();
    const rulePaper = paperElement();
    result.current.profile.paperRef.current = profilePaper;
    result.current.rule.paperRef.current = rulePaper;

    act(() => {
      result.current.profile.onEnter();
      result.current.profile.onEntered();
    });
    scroll(result.current.profile.onScroll, profilePaper, 650);

    router.key = "rule-b";
    rerender({ active: "rule" });
    act(() => {
      result.current.rule.onEnter();
      result.current.rule.onEntered();
    });
    expect(rulePaper.scrollTop).toBe(0);
    scroll(result.current.rule.onScroll, rulePaper, 240);

    router.key = "profile-a";
    rerender({ active: "profile" });
    act(() => result.current.profile.onEnter());
    expect(profilePaper.scrollTop).toBe(650);
    expect(profilePaper.scrollTo).toHaveBeenLastCalledWith({
      top: 650,
      behavior: "instant",
    });
    expect(positions.get("rule-b")).toBe(240);
  });

  it("ignores scroll events during opening and after closing", () => {
    const positions = new Map<string, number>([["profile-a", 300]]);
    const { result, rerender } = renderHook(
      ({ open }) => useDrawerScrollRestoration(open, positions),
      { initialProps: { open: true } },
    );
    const paper = paperElement();
    result.current.paperRef.current = paper;

    act(() => result.current.onEnter());
    expect(paper.scrollTop).toBe(300);
    scroll(result.current.onScroll, paper, 0);
    expect(positions.get("profile-a")).toBe(300);

    act(() => result.current.onEntered());
    scroll(result.current.onScroll, paper, 360);
    expect(positions.get("profile-a")).toBe(360);

    rerender({ open: false });
    scroll(result.current.onScroll, paper, 0);
    expect(positions.get("profile-a")).toBe(360);
  });

  it("does not restore a closed drawer", () => {
    const positions = new Map([["profile-a", 200]]);
    const { result } = renderHook(() =>
      useDrawerScrollRestoration(false, positions),
    );
    const paper = paperElement();
    result.current.paperRef.current = paper;
    act(() => result.current.onEnter());
    expect(paper.scrollTo).not.toHaveBeenCalled();
  });
});
