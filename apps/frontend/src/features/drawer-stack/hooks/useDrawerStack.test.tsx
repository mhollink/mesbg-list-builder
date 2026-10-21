import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDrawerStack } from "./useDrawerStack.ts";

const router = vi.hoisted(() => ({
  params: new URLSearchParams(),
  setSearchParams: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("react-router", () => ({
  useSearchParams: () => [router.params, router.setSearchParams],
  useNavigate: () => router.navigate,
}));

describe("useDrawerStack", () => {
  beforeEach(() => {
    router.params = new URLSearchParams();
    router.setSearchParams.mockReset();
    router.navigate.mockReset();
  });

  it("opens nested drawers without resetting page scroll or losing filters", () => {
    router.params = new URLSearchParams("search=magic&drawer=profile.gandalf");
    const { result } = renderHook(() => useDrawerStack());
    act(() => result.current.openRuleDrawer("flame-of-udun"));

    expect(router.setSearchParams).toHaveBeenCalledWith(expect.any(Function), {
      preventScrollReset: true,
    });
    const update = router.setSearchParams.mock.calls[0][0] as (
      params: URLSearchParams,
    ) => URLSearchParams;
    const next = update(router.params);
    expect(next.get("search")).toBe("magic");
    expect(next.getAll("drawer")).toEqual([
      "profile.gandalf",
      "rule.flame-of-udun",
    ]);
    expect(router.params.getAll("drawer")).toEqual(["profile.gandalf"]);
  });

  it("returns through nested history", () => {
    router.params = new URLSearchParams(
      "drawer=profile.gandalf&drawer=rule.flame-of-udun",
    );
    const { result } = renderHook(() => useDrawerStack());
    expect(result.current.canGoBack).toBe(true);
    expect(result.current.depth).toBe(2);
    expect(result.current.activeDrawer).toEqual({
      type: "rule",
      id: "flame-of-udun",
    });
    act(() => result.current.goBack());
    expect(router.navigate).toHaveBeenCalledWith(-1);
  });

  it("closes all drawers without changing page filters or scroll", () => {
    router.params = new URLSearchParams(
      "search=sword&drawer=profile.gandalf&drawer=rule.magic",
    );
    const { result } = renderHook(() => useDrawerStack());
    act(() => result.current.closeDrawer());

    expect(router.setSearchParams).toHaveBeenCalledWith(expect.any(Function), {
      preventScrollReset: true,
    });
    const update = router.setSearchParams.mock.calls[0][0] as (
      params: URLSearchParams,
    ) => URLSearchParams;
    const next = update(router.params);
    expect(next.get("search")).toBe("sword");
    expect(next.has("drawer")).toBe(false);
  });

  it("ignores invalid drawer parameters", () => {
    router.params = new URLSearchParams(
      "drawer=wrong.entry&drawer=rule.&drawer=profile.aragorn",
    );
    const { result } = renderHook(() => useDrawerStack());
    expect(result.current.drawers).toEqual([
      { type: "profile", id: "aragorn" },
    ]);
  });
});
