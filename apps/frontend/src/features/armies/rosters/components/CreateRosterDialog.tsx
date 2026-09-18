import { useState } from "react";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { useCreateRosterMutation } from "../api/roster-api.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

interface CreateRosterDialogProps {
  open: boolean;
  onClose: () => void;
  tagSuggestions: string[];
}

export function CreateRosterDialog({
  open,
  onClose,
  tagSuggestions,
}: CreateRosterDialogProps) {
  const navigate = useNavigate();
  const { armyLists } = useGameArmyLists();

  const [name, setName] = useState("");
  const [armyList, setArmyList] = useState<LocalizedArmyList | null>(null);
  const [pointsLimit, setPointsLimit] = useState<number | "">("");
  const [tags, setTags] = useState<string[]>([]);

  const [createRoster, { isLoading, isError }] = useCreateRosterMutation();

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    setName("");
    setArmyList(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!armyList || !name.trim()) {
      return;
    }

    const roster = await createRoster({
      name: name.trim(),
      armyListId: armyList.id,
      ...(pointsLimit ? { pointsLimit: Number(pointsLimit) } : {}),
      tags: tags,
    }).unwrap();

    handleClose();

    navigate(`/armies/rosters/${roster.id}`);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Create roster</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            {isError && (
              <Alert severity="error">The roster could not be created.</Alert>
            )}

            <TextField
              label="Roster name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
              fullWidth
            />

            <Autocomplete
              options={armyLists}
              value={armyList}
              onChange={(_, value) => setArmyList(value)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Army list" required />
              )}
            />

            <TextField
              label="Point limit"
              type="number"
              value={pointsLimit}
              onChange={(event) => {
                const value = event.target.value;

                setPointsLimit(value === "" ? "" : Number(value));
              }}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              helperText="Optional. We'll warn when the roster reaches or exceeds this limit."
              fullWidth
            />

            <Autocomplete
              multiple
              freeSolo
              filterSelectedOptions
              limitTags={3}
              options={tagSuggestions}
              value={tags}
              onChange={(_, values) => {
                setTags(normalizeTags(values));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tag"
                  helperText="Press Enter to add a new tag."
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={isLoading || !name.trim() || !armyList}
          >
            Create roster
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function normalizeTags(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const normalized = value.toLocaleLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}
