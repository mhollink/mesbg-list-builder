import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import type { RosterGroup, RosterSummary } from "@mlb/api-client";

import {
  useMoveRosterToGroupMutation,
  useMoveRosterToRootMutation,
} from "../../../api/roster-api";
import { flattenRosterGroups } from "../../roster-groups.utils";

interface MoveRosterDialogProps {
  roster: RosterSummary | null;
  groups: RosterGroup[];
  onClose: () => void;
}

export function MoveRosterDialog({
  roster,
  groups,
  onClose,
}: MoveRosterDialogProps) {
  const flatGroups = useMemo(() => flattenRosterGroups(groups), [groups]);

  const [target, setTarget] = useState<string>("root");

  const [moveToGroup, { isLoading: movingToGroup }] =
    useMoveRosterToGroupMutation();

  const [moveToRoot, { isLoading: movingToRoot }] =
    useMoveRosterToRootMutation();

  const isLoading = movingToGroup || movingToRoot;

  useEffect(() => {
    if (roster) {
      setTarget(roster.groupId == null ? "root" : String(roster.groupId));
    }
  }, [roster]);

  async function handleMove() {
    if (!roster) {
      return;
    }

    try {
      if (target === "root") {
        await moveToRoot(roster.id).unwrap();
      } else {
        await moveToGroup({
          rosterId: roster.id,
          groupId: Number(target),
        }).unwrap();
      }

      onClose();
    } catch {
      // optionally expose error state here
    }
  }

  return (
    <Dialog
      open={roster !== null}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Move "{roster?.name}"</DialogTitle>

      <DialogContent>
        <RadioGroup
          value={target}
          onChange={(event) => setTarget(event.target.value)}
        >
          <FormControlLabel
            value="root"
            control={<Radio />}
            label="My Rosters"
          />

          {flatGroups.map(({ group, depth }) => (
            <FormControlLabel
              key={group.id}
              value={String(group.id)}
              control={<Radio />}
              label={group.name}
              sx={{
                ml: depth * 2,
              }}
            />
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleMove}
          disabled={
            isLoading ||
            target ===
              (roster?.groupId == null ? "root" : String(roster.groupId))
          }
        >
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}
