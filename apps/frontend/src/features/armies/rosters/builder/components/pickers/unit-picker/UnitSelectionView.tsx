import { useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { PickerRow } from "~/features/armies/rosters/builder/components/pickers/unit-picker/PickerRow.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitSelectionViewProps {
  title: string;
  onClose: () => void;
  profiles: readonly LocalizedArmyListProfile[];
  onSelect: (profile: LocalizedArmyListProfile) => void;
}

export function UnitSelectionView({
  title,
  profiles,
  onSelect,
  onClose,
}: UnitSelectionViewProps) {
  const [search, setSearch] = useState("");

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return (
        profile.profile.name.toLowerCase().includes(query) ||
        profile.tierName.toLowerCase().includes(query)
      );
    });
  }, [profiles, search]);

  return (
    <Stack sx={{ minHeight: "100%" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 3,
          py: 2.5,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            flex: 1,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <IconButton onClick={onClose} aria-label="Close picker">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider />

      <Box sx={{ px: 3, py: 2 }}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          placeholder="Search profiles"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Divider />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {filteredProfiles.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{
              px: 3,
              py: 4,
              textAlign: "center",
            }}
          >
            No available profiles
          </Typography>
        ) : (
          <List disablePadding>
            {filteredProfiles.map((profile) => (
              <PickerRow
                key={profile.id}
                profile={profile}
                onSelect={() => onSelect(profile)}
              />
            ))}
          </List>
        )}
      </Box>
    </Stack>
  );
}
