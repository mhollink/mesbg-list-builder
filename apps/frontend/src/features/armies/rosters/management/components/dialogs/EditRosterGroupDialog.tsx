import { type SubmitEvent, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type { RosterGroup } from "@mlb/api-client";

import { useUpdateRosterGroupMutation } from "../../../api/roster-group-api";
import { GroupIconPicker } from "~/features/armies/rosters/management/components/group-icon-picker/GroupIconPicker.tsx";

interface RenameRosterGroupDialogProps {
  group: RosterGroup | null;
  onClose: () => void;
}

export function EditRosterGroupDialog({
  group,
  onClose,
}: RenameRosterGroupDialogProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");

  const [updateGroup, { isLoading, isError }] = useUpdateRosterGroupMutation();

  useEffect(() => {
    setName(group?.name ?? "");
    setIcon(group?.icon ?? "");
  }, [group]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!group || !name.trim()) {
      return;
    }

    try {
      await updateGroup({
        groupId: group.id,
        updateRosterGroupRequest: {
          name: name.trim(),
          icon: icon,
        },
      }).unwrap();

      onClose();
    } catch {
      // rendered below
    }
  }

  return (
    <Dialog
      open={group !== null}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Rename group</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Could not update the group.
              </Alert>
            )}

            <TextField
              autoFocus
              fullWidth
              label="Group name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <GroupIconPicker value={icon} onChange={setIcon} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              !name.trim() ||
              (name.trim() === group?.name && icon === group?.icon) ||
              isLoading
            }
          >
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
