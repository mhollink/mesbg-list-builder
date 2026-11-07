import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import type { RosterSummary, UpdateRosterRequest } from "@mlb/api-client";

import { useUpdateRosterMutation } from "~/features/armies/rosters/api/rosters-api.ts";
import { normalizeRosterTags } from "~/features/armies/rosters/management/roster-tags.utils.ts";

interface EditRosterDialogProps {
  roster: RosterSummary | null;
  tagSuggestions: string[];
  onClose: () => void;
}

export function EditRosterDialog({
  roster,
  tagSuggestions,
  onClose,
}: EditRosterDialogProps) {
  const [name, setName] = useState("");
  const [pointsLimit, setPointsLimit] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [updateRoster, { isLoading, isError, reset }] =
    useUpdateRosterMutation();

  useEffect(() => {
    if (!roster) return;

    setName(roster.name);
    setPointsLimit(roster.pointsLimit?.toString() ?? "");
    setTags(roster.tags ?? []);
    reset();
  }, [roster, reset]);

  const parsedLimit = pointsLimit === "" ? null : Number(pointsLimit);
  const validLimit =
    parsedLimit === null || (Number.isInteger(parsedLimit) && parsedLimit > 0);
  const validName = name.trim().length > 0 && name.trim().length <= 255;

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!roster || !validName || !validLimit) return;

    const request: UpdateRosterRequest = {
      name: name.trim(),
      tags: normalizeRosterTags(tags),
    };

    if (parsedLimit === null) {
      if (roster.pointsLimit != null) {
        request.clearPointsLimit = true;
      }
    } else {
      request.pointsLimit = parsedLimit;
    }

    try {
      await updateRoster({ rosterId: roster.id, request }).unwrap();
      onClose();
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
        <DialogTitle>Edit roster details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {isError && (
              <Alert severity="error">The roster could not be updated.</Alert>
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
            <TextField
              label="Point limit"
              type="number"
              fullWidth
              value={pointsLimit}
              onChange={(event) => setPointsLimit(event.target.value)}
              error={!validLimit}
              helperText="Optional. Clear the field to remove the limit."
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
            <Autocomplete
              multiple
              freeSolo
              filterSelectedOptions
              limitTags={3}
              options={tagSuggestions}
              value={tags}
              onChange={(_, values) => setTags(normalizeRosterTags(values))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tag"
                  helperText="Press Enter to add a tag."
                />
              )}
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
            disabled={isLoading || !validName || !validLimit}
          >
            Save changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
