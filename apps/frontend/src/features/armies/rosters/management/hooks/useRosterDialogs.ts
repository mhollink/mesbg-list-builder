import { useState } from "react";

import type { RosterGroup, RosterSummary } from "@mlb/api-client";

export function useRosterDialogs() {
  const [createRosterOpen, setCreateRosterOpen] = useState(false);

  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const [rosterToDelete, setRosterToDelete] = useState<RosterSummary | null>(
    null,
  );

  const [rosterToMove, setRosterToMove] = useState<RosterSummary | null>(null);

  const [groupToRename, setGroupToRename] = useState<RosterGroup | null>(null);

  const [groupToDelete, setGroupToDelete] = useState<RosterGroup | null>(null);

  return {
    createRoster: {
      open: createRosterOpen,
      show: () => setCreateRosterOpen(true),
      close: () => setCreateRosterOpen(false),
    },

    createGroup: {
      open: createGroupOpen,
      show: () => setCreateGroupOpen(true),
      close: () => setCreateGroupOpen(false),
    },

    deleteRoster: {
      roster: rosterToDelete,
      open: setRosterToDelete,
      close: () => setRosterToDelete(null),
    },

    moveRoster: {
      roster: rosterToMove,
      open: setRosterToMove,
      close: () => setRosterToMove(null),
    },

    renameGroup: {
      group: groupToRename,
      open: setGroupToRename,
      close: () => setGroupToRename(null),
    },

    deleteGroup: {
      group: groupToDelete,
      open: setGroupToDelete,
      close: () => setGroupToDelete(null),
    },
  };
}
