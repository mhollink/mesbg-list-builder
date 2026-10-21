import type {UIEvent} from "react";
import {useCallback, useLayoutEffect, useRef} from "react";
import {useLocation} from "react-router";

export function useDrawerScrollRestoration(
  open: boolean,
  positions: Map<string, number>,
) {
  const { key } = useLocation();

  const paperRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const enteringRef = useRef(false);

  const restoreScroll = useCallback(() => {
    const paper = paperRef.current;

    if (!open || !paper) {
      return;
    }

    paper.scrollTo({
      top: positions.get(key) ?? 0,
      behavior: "instant",
    });
  }, [key, open, positions]);

  useLayoutEffect(() => {
    enteringRef.current = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (open) {
      restoreScroll();
    }
  }, [open, restoreScroll]);

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (!open || enteringRef.current) {
        return;
      }

      positions.set(key, event.currentTarget.scrollTop);
    },
    [key, open, positions],
  );

  const onEnter = useCallback(() => {
    restoreScroll();
  }, [restoreScroll]);

  const onEntered = useCallback(() => {
    enteringRef.current = false;
  }, []);

  return { paperRef, onScroll, onEnter, onEntered };
}
