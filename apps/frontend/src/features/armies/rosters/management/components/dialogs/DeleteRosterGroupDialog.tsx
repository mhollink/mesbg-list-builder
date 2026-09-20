import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { RosterGroup } from "@mlb/api-client";

import { useDeleteRosterGroupMutation } from "../../../api/roster-group-api";

interface DeleteRosterGroupDialogProps {
  group: RosterGroup | null;
  onClose: () => void;
}

export function DeleteRosterGroupDialog({
  group,
  onClose,
}: DeleteRosterGroupDialogProps) {
  const [deleteGroup, { isLoading, isError }] = useDeleteRosterGroupMutation();

  async function handleDelete() {
    if (!group) {
      return;
    }

    try {
      await deleteGroup(group.id).unwrap();
      onClose();
    } catch {
      // rendered below
    }
  }

  return (
    <Dialog open={group !== null} onClose={isLoading ? undefined : onClose}>
      <DialogTitle>Delete group?</DialogTitle>

      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            The group could not be deleted. Only empty groups can be removed.
          </Alert>
        )}

        <DialogContentText>Delete "{group?.name}"?</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button color="error" onClick={handleDelete} disabled={isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
