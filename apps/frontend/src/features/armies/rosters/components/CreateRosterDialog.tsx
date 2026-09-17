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
}

export function CreateRosterDialog({ open, onClose }: CreateRosterDialogProps) {
  const navigate = useNavigate();
  const { armyLists } = useGameArmyLists();

  const [name, setName] = useState("");
  const [armyList, setArmyList] = useState<LocalizedArmyList | null>(null);

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
