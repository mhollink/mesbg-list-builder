import { useEffect, useRef, useState } from "react";

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import type {
  BuilderRoster,
  BuilderUnitId,
  BuilderWarband,
  BuilderWarbandId,
} from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { RosterPersistence } from "~/features/armies/rosters/builder/persistence/roster-persistence.types.ts";

export function useRosterSorting(
  roster: BuilderRoster,
  actions: RosterPersistence,
) {
  /*
   * Local representation of the warbands.
   *
   * We render this instead of roster.warbands so a server
   * refetch cannot replace the sortable structure while
   * dnd-kit is actively dragging.
   */
  const [warbands, setWarbands] = useState(roster.warbands);

  const [targetWarbandId, setTargetWarbandId] =
    useState<BuilderWarbandId | null>(null);

  const [isError, setIsError] = useState(false);

  const isDraggingRef = useRef(false);

  /*
   * Synchronize the local representation with the actual
   * roster whenever there is no active drag operation.
   */
  useEffect(() => {
    if (!isDraggingRef.current) {
      setWarbands(roster.warbands);
    }
  }, [roster.warbands]);

  const handleDragStart = (_event: DragStartEvent) => {
    isDraggingRef.current = true;

    setIsError(false);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;

    if (!source || !target || !isSortable(source)) {
      setTargetWarbandId(null);
      return;
    }

    /*
     * If we're directly over the warband fallback target,
     * use its explicit ID.
     */
    if (target.data?.kind === "warband") {
      setTargetWarbandId(target.data.warbandId as BuilderWarbandId);

      return;
    }

    /*
     * Optimistic sorting updates source.group as the item
     * moves between sortable groups.
     *
     * This also works when source/target refer to the same
     * sortable element during optimistic sorting.
     */
    if (source.group != null) {
      setTargetWarbandId(source.group as BuilderWarbandId);

      return;
    }

    setTargetWarbandId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    /*
     * The drag operation itself has finished. Server data may
     * safely synchronize again after this point.
     */
    isDraggingRef.current = false;

    setTargetWarbandId(null);

    if (event.canceled) {
      /*
       * React state was never changed during dragging, so
       * there is nothing to roll back.
       */
      setWarbands(roster.warbands);

      return;
    }

    const { source, target } = event.operation;

    if (
      !source ||
      !target ||
      !isSortable(source) ||
      source.initialGroup == null
    ) {
      return;
    }

    const sourceWarbandId = source.initialGroup as BuilderWarbandId;

    const sourceIndex = source.initialIndex;

    let destinationWarbandId: BuilderWarbandId;
    let destinationIndex: number;

    /*
     * Dropping directly on the warband itself means:
     *
     * append the follower to the end of that warband.
     */
    if (target.data?.kind === "warband") {
      destinationWarbandId = target.data.warbandId as BuilderWarbandId;

      const targetWarband = warbands.find(
        (warband) => warband.id === destinationWarbandId,
      );

      if (!targetWarband) {
        return;
      }

      /*
       * When appending within the same warband, removal of the
       * source decreases its length by one.
       */
      destinationIndex =
        sourceWarbandId === destinationWarbandId
          ? Math.max(0, targetWarband.followers.length - 1)
          : targetWarband.followers.length;
    } else {
      /*
       * For a normal sortable drop, optimistic sorting has
       * already calculated the final group and index for us.
       */
      if (source.group == null) {
        return;
      }

      destinationWarbandId = source.group as BuilderWarbandId;

      destinationIndex = source.index;
    }

    /*
     * Nothing changed.
     */
    if (
      sourceWarbandId === destinationWarbandId &&
      sourceIndex === destinationIndex
    ) {
      return;
    }

    /*
     * Commit dnd-kit's optimistic position into React state.
     *
     * At this point the DOM has already visually moved there,
     * so React simply catches up with what the user saw.
     */
    setWarbands((current) =>
      moveFollower(
        current,
        source.id as BuilderUnitId,
        destinationWarbandId,
        destinationIndex,
      ),
    );

    try {
      await actions.moveUnit(
        sourceWarbandId,
        source.id as BuilderUnitId,
        destinationWarbandId,
        destinationIndex,
      );
    } catch {
      /*
       * Persistence failed, so restore the authoritative
       * roster.
       */
      setWarbands(roster.warbands);
      setIsError(true);
    }
  };

  return {
    warbands,

    handleDragStart,
    handleDragOver,
    handleDragEnd,

    targetWarbandId,
    isError,

    clearError: () => setIsError(false),
  };
}

function moveFollower(
  warbands: BuilderWarband[],
  unitId: BuilderUnitId,
  targetWarbandId: BuilderWarbandId,
  targetIndex: number,
): BuilderWarband[] {
  const follower = warbands
    .flatMap((warband) => warband.followers)
    .find((candidate) => candidate.id === unitId);

  if (!follower) {
    return warbands;
  }

  /*
   * Remove the follower from whichever warband currently
   * contains it.
   *
   * Removing by ID also guarantees that an accidental
   * duplicate cannot survive this operation.
   */
  const withoutFollower = warbands.map((warband) => ({
    ...warband,

    followers: warband.followers.filter((candidate) => candidate.id !== unitId),
  }));

  return withoutFollower.map((warband) => {
    if (warband.id !== targetWarbandId) {
      return warband;
    }

    const followers = [...warband.followers];

    const position = Math.max(0, Math.min(targetIndex, followers.length));

    followers.splice(position, 0, follower);

    return {
      ...warband,
      followers,
    };
  });
}
