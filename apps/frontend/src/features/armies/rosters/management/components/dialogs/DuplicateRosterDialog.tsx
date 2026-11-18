import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";

import type { DuplicateRosterRequest, RosterSummary } from "@mlb/api-client";

import Switch from "~/components/switch/StyledSwitch.tsx";
import { useDuplicateRosterMutation } from "~/features/armies/rosters/api/rosters-api.ts";
import { useNavigate } from "react-router";

interface DuplicateRosterDialogProps {
  roster: RosterSummary | null;
  onClose: () => void;
}

export function DuplicateRosterDialog({
  roster,
  onClose,
}: DuplicateRosterDialogProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [locked, setLocked] = useState(false);

  const [duplicateRoster, { isLoading, isError, reset }] =
    useDuplicateRosterMutation();

  useEffect(() => {
    if (!roster) return;

    setName(`${roster.name} (copy)`);
    setFavorite(false);
    setLocked(false);
    reset();
  }, [roster, reset]);

  const validName = name.trim().length > 0 && name.trim().length <= 255;

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!roster || !validName) return;

    const request: DuplicateRosterRequest = {
      name: name.trim(),
      favorite,
      locked,
    };

    try {
      const newRoster = await duplicateRoster({ rosterId: roster.id, request }).unwrap();
      onClose();
      navigate(`/armies/rosters/${newRoster.id}`);
    } catch {
      // RTK Query exposes the error via isError inside the dialog.
    }
  };

  return (
    <Dialog
      open={roster !== null}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Duplicate roster</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {isError && (
              <Alert severity="error">The roster could not be duplicated</Alert>
            )}
            <TextField
              label="Roster name"
              required
              autoFocus
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
            <FormControlLabel
              sx={{ m: 0, minWidth: 0 }}
              control={
                <Switch
                  checked={favorite}
                  onChange={(_, next) => setFavorite(next)}
                />
              }
              label="Add to favorites"
            />
            <FormControlLabel
              sx={{ m: 0, minWidth: 0 }}
              control={
                <Switch
                  checked={locked}
                  onChange={(_, next) => setLocked(next)}
                />
              }
              label="Lock new roster"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !validName}
          >
            Duplicate roster
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
