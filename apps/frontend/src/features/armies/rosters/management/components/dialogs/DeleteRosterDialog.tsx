import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { RosterSummary } from "@mlb/api-client";

import { useDeleteRosterMutation } from "../../../api/roster-api.ts";

interface DeleteRosterDialogProps {
  roster: RosterSummary | null;
  onClose: () => void;
}

export function DeleteRosterDialog({
  roster,
  onClose,
}: DeleteRosterDialogProps) {
  const [deleteRoster, { isLoading, isError }] = useDeleteRosterMutation();

  const handleDelete = async () => {
    if (!roster) {
      return;
    }

    await deleteRoster(roster.id).unwrap();
    onClose();
  };

  return (
    <Dialog
      open={Boolean(roster)}
      onClose={isLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Delete roster?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {roster ? `Delete "${roster.name}"? This cannot be undone.` : ""}
        </DialogContentText>

        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            The roster could not be deleted.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
