import { useEffect, useMemo, useRef, useState } from "react";

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
  applyRosterSortLayout,
  createRosterSortLayout,
  followerSortId,
  warbandSortId,
} from "./roster-sort-layout.ts";

export function useRosterSorting(
  roster: BuilderRoster,
  persistence: RosterPersistence,
) {
  const [layout, setLayout] = useState(() =>
    createRosterSortLayout(roster.warbands),
  );

  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const snapshot = useRef(layout);
  const isDragging = useRef(false);
  const isPersisting = useRef(false);

  // Keep external roster changes separate from an active drag.
  useEffect(() => {
    if (!isDragging.current && !isPersisting.current) {
      setLayout(createRosterSortLayout(roster.warbands));
    }
  }, [roster.warbands]);

  const warbands = useMemo(
    () => applyRosterSortLayout(roster.warbands, layout),
    [roster.warbands, layout],
  );

  function handleDragStart(_event: DragStartEvent) {
    isDragging.current = true;
    snapshot.current = layout;
    setIsError(false);
  }

  function handleDragOver(event: DragOverEvent) {
    const { source, target } = event.operation;

    if (source?.type !== "follower" || !target) {
      return;
    }

    setLayout((current) => ({
      ...current,
      followers: move(current.followers, event),
    }));
  }

  async function handleDragEnd(event: DragEndEvent) {
    isDragging.current = false;

    if (event.canceled) {
      setLayout(snapshot.current);
      return;
    }

    const { source, target } = event.operation;

    if (!isSortable(source) || !target) {
      setLayout(snapshot.current);
      return;
    }

    if (source.type === "warband") {
      setLayout((current) => ({
        ...current,
        order: move(current.order, event),
      }));

      if (source.initialIndex === source.index) {
        return;
      }

      const warband = roster.warbands.find(
        (item) => warbandSortId(item.id) === source.id,
      );

      if (!warband) {
        setLayout(snapshot.current);
        return;
      }

      isPersisting.current = true;
      setIsSaving(true);

      try {
        await persistence.moveWarband(warband.id, source.index);
      } catch {
        setLayout(snapshot.current);
        setIsError(true);
      } finally {
        isPersisting.current = false;
        setIsSaving(false);
      }

      return;
    }

    if (source.type !== "follower") {
      return;
    }

    // Reconcile the final optimistic follower position.
    setLayout((current) => ({
      ...current,
      followers: move(current.followers, event),
    }));

    if (source.initialGroup == null || source.group == null) {
      setLayout(snapshot.current);
      return;
    }

    const sourceWarband = roster.warbands.find(
      (warband) => warbandSortId(warband.id) === source.initialGroup,
    );

    const targetWarband = roster.warbands.find(
      (warband) => warbandSortId(warband.id) === source.group,
    );

    const follower = sourceWarband?.followers.find(
      (unit) => followerSortId(unit.id) === source.id,
    );

    if (!sourceWarband || !targetWarband || !follower) {
      setLayout(snapshot.current);
      return;
    }

    if (
      source.initialGroup === source.group &&
      source.initialIndex === source.index
    ) {
      return;
    }

    isPersisting.current = true;
    setIsSaving(true);

    try {
      await persistence.moveUnit(
        sourceWarband.id,
        follower.id,
        targetWarband.id,
        source.index,
      );
    } catch {
      setLayout(snapshot.current);
      setIsError(true);
    } finally {
      isPersisting.current = false;
      setIsSaving(false);
    }
  }

  return {
    warbands,
    isError,
    isSaving,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
