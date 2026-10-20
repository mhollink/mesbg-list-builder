import { Fragment, useMemo, useState } from "react";
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
import ListSubheader from "@mui/material/ListSubheader";

import { createTierGroups } from "~/features/reference/army-lists/army-list-composition.utils.ts";
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

  const profileGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filteredProfiles = profiles.filter(
      (profile) =>
        !query ||
        profile.profile.name.toLowerCase().includes(query) ||
        profile.tierName.toLowerCase().includes(query),
    );

    return createTierGroups(filteredProfiles).map((group) => ({
      ...group,
      profiles: [...group.profiles].sort((a, b) =>
        a.profile.name.localeCompare(b.profile.name),
      ),
    }));
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
        {profileGroups.length === 0 ? (
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
              {profileGroups.map((group) => (
                <Fragment key={group.tier}>
                  <ListSubheader disableSticky>
                    <Divider textAlign="left" >
                      <Typography
                        variant="overline"
                        color="textSecondary"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {group.profiles[0].tierName}
                      </Typography>
                    </Divider>
                  </ListSubheader>

                  {group.profiles.map((profile) => (
                    <PickerRow
                      key={profile.id}
                      profile={profile}
                      onSelect={() => onSelect(profile)}
                    />
                  ))}
                </Fragment>
              ))}
            </List>
          )}
      </Box>
    </Stack>
  );
}
