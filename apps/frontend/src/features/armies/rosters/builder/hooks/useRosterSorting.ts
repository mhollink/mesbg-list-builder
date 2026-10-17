import { useState } from "react";

import type { DragEndEvent, DragOverEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import type {
  BuilderRoster,
  BuilderUnitId,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";

export function useRosterSorting(
  roster: BuilderRoster,
  actions: RosterPersistence,
) {
  const [targetWarbandId, setTargetWarbandId] =
    useState<BuilderWarbandId | null>(null);
  const [isError, setIsError] = useState(false);

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;

    if (!target) {
      setTargetWarbandId(null);
      return;
    }

    // Directly over the warband fallback target.
    if (target.data?.kind === "warband") {
      setTargetWarbandId(target.data.warbandId as BuilderWarbandId);
      return;
    }

    // Directly over one of its sortable followers.
    if (isSortable(target) && target.group != null) {
      setTargetWarbandId(target.group as BuilderWarbandId);
      return;
    }

    // With optimistic sorting, the source's current group
    // may already represent the warband it has moved over.
    if (isSortable(source) && source.group != null) {
      setTargetWarbandId(source.group as BuilderWarbandId);
      return;
    }

    setTargetWarbandId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setTargetWarbandId(null);
    if (event.canceled) {
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target || !isSortable(source)) {
      return;
    }

    const sourceWarbandId = source.initialGroup as BuilderWarbandId;

    // Dropped directly on a follower.
    if (isSortable(target)) {
      await actions.moveUnit(
        sourceWarbandId,
        source.id as BuilderUnitId,
        target.group as BuilderWarbandId,
        target.index,
      );

      return;
    }

    // Dropped somewhere on the warband itself.
    if (target.data?.kind === "warband") {
      const targetWarbandId = target.data.warbandId as BuilderWarbandId;

      const targetWarband = roster.warbands.find(
        (warband) => warband.id === targetWarbandId,
      );

      if (!targetWarband) {
        return;
      }

      await actions.moveUnit(
        sourceWarbandId,
        source.id as BuilderUnitId,
        targetWarbandId,
        targetWarband.followers.length,
      );
    }
  };

  return {
    handleDragOver,
    handleDragEnd,
    targetWarbandId,
    isError,
    clearError: () => setIsError(false),
  };
}
