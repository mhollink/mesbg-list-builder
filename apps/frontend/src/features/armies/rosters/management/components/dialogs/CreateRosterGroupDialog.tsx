import { type SubmitEvent, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { useCreateRosterGroupMutation } from "../../../api/roster-group-api";

interface CreateRosterGroupDialogProps {
  open: boolean;
  parentGroupId?: number ;
  onClose: () => void;
}

export function CreateRosterGroupDialog({
  open,
  parentGroupId,
  onClose,
}: CreateRosterGroupDialogProps) {
  const [name, setName] = useState("");

  const [createGroup, { isLoading, isError }] = useCreateRosterGroupMutation();

  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      await createGroup({
        name: trimmedName,
        parentGroupId: parentGroupId,
      }).unwrap();

      onClose();
    } catch {
      // RTK Query error state renders below.
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Create group</DialogTitle>

        <DialogContent>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Could not create the group.
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Group name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim() || isLoading}
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
