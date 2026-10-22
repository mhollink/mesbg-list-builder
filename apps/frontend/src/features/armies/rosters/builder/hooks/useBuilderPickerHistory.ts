import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export type BuilderPicker =
  | { type: "warband-create"; mode: "single" | "continuous" }
  | { type: "leader-edit"; warbandId: string }
  | { type: "follower-add"; warbandId: string }
  | { type: "follower-edit"; warbandId: string; unitId: string };

const PICKER = "builderPicker";
const MODE = "builderMode";
const WARBAND = "builderWarbandId";
const UNIT = "builderUnitId";
const PROFILE = "builderProfileId";
const PICKER_PARAMS = [PICKER, MODE, WARBAND, UNIT, PROFILE];
const DEPTH = "builderPickerDepth";

function parsePicker(params: URLSearchParams): BuilderPicker | null {
  const type = params.get(PICKER);
  const warbandId = params.get(WARBAND);

  switch (type) {
    case "warband-create":
      return {
        type,
        mode: params.get(MODE) === "continuous" ? "continuous" : "single",
      };
    case "leader-edit":
    case "follower-add":
      return warbandId ? { type, warbandId } : null;
    case "follower-edit": {
      const unitId = params.get(UNIT);
      return warbandId && unitId ? { type, warbandId, unitId } : null;
    }
    default:
      return null;
  }
}

function clearPickerParams(params: URLSearchParams): URLSearchParams {
  for (const key of PICKER_PARAMS) {
    params.delete(key);
  }
  return params;
}

export function useBuilderPickerHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const picker = parsePicker(params);
  const profileId = picker ? (params.get(PROFILE) ?? undefined) : undefined;
  const state: Record<string, unknown> =
    location.state && typeof location.state === "object"
      ? (location.state as Record<string, unknown>)
      : {};
  const depth =
    picker &&
    typeof state[DEPTH] === "number" &&
    Number.isInteger(state[DEPTH]) &&
    state[DEPTH] > 0
      ? (state[DEPTH] as number)
      : 0;

  const navigateWithParams = useCallback(
    (next: URLSearchParams, nextDepth: number, replace = false) => {
      const nextState = { ...state };
      if (nextDepth > 0) {
        nextState[DEPTH] = nextDepth;
      } else {
        delete nextState[DEPTH];
      }

      navigate(
        {
          pathname: location.pathname,
          search: next.toString() ? `?${next}` : "",
          hash: location.hash,
        },
        { replace, preventScrollReset: true, state: nextState },
      );
    },
    [location.pathname, location.hash, navigate, state],
  );

  const openPicker = useCallback(
    (nextPicker: BuilderPicker) => {
      const next = clearPickerParams(new URLSearchParams(location.search));
      next.set(PICKER, nextPicker.type);
      if (nextPicker.type === "warband-create") {
        next.set(MODE, nextPicker.mode);
      } else {
        next.set(WARBAND, nextPicker.warbandId);
        if (nextPicker.type === "follower-edit") {
          next.set(UNIT, nextPicker.unitId);
        }
      }
      navigateWithParams(next, 1);
    },
    [location.search, navigateWithParams],
  );

  const configure = useCallback(
    (selectedProfileId: string) => {
      if (!picker) return;
      const next = new URLSearchParams(location.search);
      next.set(PROFILE, selectedProfileId);
      navigateWithParams(next, depth + 1);
    },
    [picker, location.search, depth, navigateWithParams],
  );

  const back = useCallback(() => {
    if (!profileId) return;
    if (depth > 0) {
      navigate(-1);
    } else {
      const next = new URLSearchParams(location.search);
      next.delete(PROFILE);
      navigateWithParams(next, 0, true);
    }
  }, [profileId, depth, navigate, location.search, navigateWithParams]);

  const close = useCallback(() => {
    if (!picker) return;
    if (depth > 0) {
      navigate(-depth);
    } else {
      navigateWithParams(
        clearPickerParams(new URLSearchParams(location.search)),
        0,
        true,
      );
    }
  }, [picker, depth, navigate, location.search, navigateWithParams]);

  return { picker, profileId, depth, openPicker, configure, back, close };
}
