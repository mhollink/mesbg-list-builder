import { type ComponentProps, useState } from "react";

import type { DragDropProvider } from "@dnd-kit/react";

import {
  useMoveRosterToGroupMutation,
  useMoveRosterToRootMutation,
} from "../../api/roster-api";
import {
  useMoveRosterGroupMutation,
  useMoveRosterGroupToRootMutation,
} from "~/features/armies/rosters/api/roster-group-api.ts";

type DragEndEvent = Parameters<
  NonNullable<ComponentProps<typeof DragDropProvider>["onDragEnd"]>
>[0];

interface RosterDragData {
  type: "roster";
  rosterId: number;
}

interface GroupDragData {
  type: "group";
  groupId: number;
}

type DragData = RosterDragData | GroupDragData;

interface GroupDropData {
  type: "group";
  groupId: number;
}

interface RootDropData {
  type: "root";
}

type DropData = GroupDropData | RootDropData;

export function useRosterDragAndDrop() {
  const [moveRosterToGroup] = useMoveRosterToGroupMutation();
  const [moveRosterToRoot] = useMoveRosterToRootMutation();
  const [moveGroup] = useMoveRosterGroupMutation();
  const [moveGroupToRoot] = useMoveRosterGroupToRootMutation();

  const [isError, setIsError] = useState(false);

  async function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) {
      return;
    }

    const { source, target } = event.operation;

    if (!source || !target) {
      return;
    }

    const sourceData = source.data as DragData | undefined;
    const targetData = target.data as DropData | undefined;

    if (!sourceData || !targetData) {
      return;
    }

    setIsError(false);

    try {
      if (sourceData.type === "roster") {
        await moveRoster(sourceData, targetData);
      } else if (sourceData.type === "group") {
        await moveGroupItem(sourceData, targetData);
      }
    } catch {
      setIsError(true);
    }
  }

  async function moveRoster(source: RosterDragData, target: DropData) {
    if (target.type === "root") {
      await moveRosterToRoot(source.rosterId);
      return;
    }

    return await moveRosterToGroup({
      groupId: target.groupId,
      rosterId: source.rosterId,
    }).unwrap();
  }

  async function moveGroupItem(source: GroupDragData, target: DropData) {
    if (target.type === "root") {
      await moveGroupToRoot({ groupId: source.groupId }).unwrap();
      return;
    }

    if (source.groupId === target.groupId) {
      return;
    }

    await moveGroup({
      groupId: source.groupId,
      parentGroupId: target.groupId,
    }).unwrap();
  }

  return {
    handleDragEnd,
    isError,
    clearError: () => setIsError(false),
  };
}
