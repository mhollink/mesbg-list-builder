import { useMemo, useState } from "react";
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
import Typography from "@mui/material/Typography";

import { useCreateRosterMutation } from "../api/roster-api.ts";
import { HeraldryIcon } from "~/components/heraldry/HeraldryIcon.tsx";
import { getArmyListHeraldry } from "~/components/heraldry/heraldry.const.ts";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types.ts";
import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

const alignmentOrder = {
  good: 0,
  evil: 1,
} as const;

const LEGACY_BOOKS = new Set([
  "good-legacies-of-middle-earth-pdf",
  "evil-legacies-of-middle-earth-pdf",
]);

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

  const sortedArmyLists = useMemo(
    () =>
      [...armyLists].sort((a, b) => {
        const alignment =
          alignmentOrder[a.alignment] - alignmentOrder[b.alignment];

        return alignment !== 0 ? alignment : a.name.localeCompare(b.name);
      }),
    [armyLists],
  );

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
              options={sortedArmyLists}
              value={armyList}
              onChange={(_, value) => setArmyList(value)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              groupBy={(option) => option.alignment}
              renderGroup={(params) => (
                <li key={params.key}>
                  <Typography
                    component="div"
                    variant="overline"
                    sx={{
                      px: 2,
                      py: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    {params.group === "good" ? "Good" : "Evil"}
                  </Typography>

                  <Box component="ul" sx={{ p: 0 }}>
                    {params.children}
                  </Box>
                </li>
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    ...props.style,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <HeraldryIcon
                    iconName={getArmyListHeraldry(option.id)}
                    size={20}
                  />

                  <Typography
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {option.name}
                  </Typography>

                  {isLegacyArmyList(option) && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        ml: "auto",
                        flexShrink: 0,
                      }}
                    >
                      Legacy
                    </Typography>
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Army list" />
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

function isLegacyArmyList(armyList: LocalizedArmyList) {
  return LEGACY_BOOKS.has(armyList.source.book);
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
