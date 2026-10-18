import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { move } from "@dnd-kit/helpers";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import type { BuilderRoster } from "../domain/roster.types.ts";
import type { RosterPersistence } from "../persistence/roster-persistence.types.ts";
import {
  appendFollower,
  applyRosterSortLayout,
  createRosterSortLayout,
  findFollowerPosition,
  type RosterSortLayout,
  sameRosterSortLayout,
  warbandSortId,
} from "./roster-sort-layout.ts";

export function useRosterSorting(
  roster: BuilderRoster,
  persistence: RosterPersistence,
) {
  const [layout, setLayout] = useState(() =>
    createRosterSortLayout(roster.warbands),
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  const layoutRef = useRef(layout);
  const snapshot = useRef(layout);
  const dragging = useRef(false);
  const saving = useRef(false);

  const latestWarbands = useRef(roster.warbands);
  latestWarbands.current = roster.warbands;

  // Keep the optimistic result until the server has
  // returned the corresponding follower ordering.
  const pending = useRef<RosterSortLayout | null>(null);

  const updateLayout = useCallback((next: RosterSortLayout) => {
    layoutRef.current = next;
    setLayout(next);
  }, []);

  useEffect(() => {
    if (dragging.current || saving.current) {
      return;
    }

    const incoming = createRosterSortLayout(roster.warbands);

    if (pending.current && !sameRosterSortLayout(incoming, pending.current)) {
      return;
    }

    pending.current = null;
    updateLayout(incoming);
  }, [roster.warbands, updateLayout]);

  const warbands = useMemo(
    () => applyRosterSortLayout(roster.warbands, layout),
    [roster.warbands, layout],
  );

  function handleDragStart(_event: DragStartEvent) {
    dragging.current = true;
    snapshot.current = layoutRef.current;

    setIsDragging(true);
    setIsError(false);
  }

  function handleDragOver(event: DragOverEvent) {
    const { source, target } = event.operation;

    if (
      !dragging.current ||
      !isSortable(source) ||
      source.type !== "follower" ||
      !target
    ) {
      return;
    }

    if (target.data?.kind === "warband") {
      const next = appendFollower(
        layoutRef.current,
        String(source.id),
        warbandSortId(target.data.warbandId),
      );

      updateLayout(next);
      return;
    }

    if (target.data?.kind === "follower") {
      updateLayout(move(layoutRef.current, event));
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    dragging.current = false;
    setIsDragging(false);

    const { source, target } = event.operation;

    if (
      event.canceled ||
      !isSortable(source) ||
      source.type !== "follower" ||
      !target
    ) {
      updateLayout(snapshot.current);
      return;
    }

    // Resolve direct container drops consistently.
    if (target.data?.kind === "warband") {
      updateLayout(
        appendFollower(
          layoutRef.current,
          String(source.id),
          warbandSortId(target.data.warbandId),
        ),
      );
    } else if (target.data?.kind !== "follower") {
      updateLayout(snapshot.current);
      return;
    }

    const initial = findFollowerPosition(snapshot.current, String(source.id));

    const destination = findFollowerPosition(
      layoutRef.current,
      String(source.id),
    );

    if (!initial || !destination) {
      updateLayout(snapshot.current);
      return;
    }

    if (
      initial.warbandId === destination.warbandId &&
      initial.index === destination.index
    ) {
      return;
    }

    const sourceWarband = roster.warbands.find(
      (warband) => warbandSortId(warband.id) === initial.warbandId,
    );

    const targetWarband = roster.warbands.find(
      (warband) => warbandSortId(warband.id) === destination.warbandId,
    );

    const follower = sourceWarband?.followers.find(
      (unit) => `follower:${unit.id}` === source.id,
    );

    if (
      !sourceWarband ||
      !targetWarband?.leader ||
      !follower ||
      roster.locked
    ) {
      updateLayout(snapshot.current);
      return;
    }

    saving.current = true;
    setIsSaving(true);

    const committedLayout = layoutRef.current;

    try {
      await persistence.moveUnit(
        sourceWarband.id,
        follower.id,
        targetWarband.id,
        destination.index,
      );

      pending.current = committedLayout;

      // Guest updates or a fast refetch may already
      // have supplied the authoritative ordering.
      const incoming = createRosterSortLayout(latestWarbands.current);

      if (sameRosterSortLayout(incoming, committedLayout)) {
        pending.current = null;
        updateLayout(incoming);
      }
    } catch {
      pending.current = null;
      updateLayout(createRosterSortLayout(latestWarbands.current));
      setIsError(true);
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }

  return {
    warbands,
    isDragging,
    isSaving,
    isError,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
