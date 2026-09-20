import { type ComponentProps, useState } from "react";

import type { DragDropProvider } from "@dnd-kit/react";
import type { RosterSummary } from "@mlb/api-client";

import {
  useMoveRosterToGroupMutation,
  useMoveRosterToRootMutation,
} from "../../api/roster-api";

type DragEndEvent = Parameters<
  NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
>[0];

interface RosterDragData {
  type: "roster";
  rosterId: number;
}

interface GroupDropData {
  type: "group";
  groupId: number;
}

interface RootDropData {
  type: "root";
}

type DropData = GroupDropData | RootDropData;

export function useRosterDragAndDrop(rosters: RosterSummary[]) {
  const [moveToGroup] = useMoveRosterToGroupMutation();

  const [moveToRoot] = useMoveRosterToRootMutation();

  const [isError, setIsError] = useState(false);

  async function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) {
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target) {
      return;
    }

    const sourceData = source.data as RosterDragData | undefined;

    const targetData = target.data as DropData | undefined;

    if (sourceData?.type !== "roster") {
      return;
    }

    const roster = rosters.find(
      (candidate) => candidate.id === sourceData.rosterId,
    );

    if (!roster) {
      return;
    }

    setIsError(false);

    try {
      if (targetData?.type === "group") {
        if (roster.groupId === targetData.groupId) {
          return;
        }

        await moveToGroup({
          rosterId: roster.id,
          groupId: targetData.groupId,
        }).unwrap();

        return;
      }

      if (targetData?.type === "root" && roster.groupId != null) {
        await moveToRoot(roster.id).unwrap();
      }
    } catch {
      setIsError(true);
    }
  }

  return {
    handleDragEnd,
    isError,
    clearError: () => setIsError(false),
  };
}
