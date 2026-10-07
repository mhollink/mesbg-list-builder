import { useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UnitHeroicStats } from "../units/UnitHeroicStats.tsx";
import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface UnitPickerProps {
  open: boolean;
  title: string;
  profiles: readonly LocalizedArmyListProfile[];

  onClose: () => void;
  onSelect: (profile: LocalizedArmyListProfile) => Promise<void>;
}

export function UnitPicker({
  open,
  title,
  profiles,
  onClose,
  onSelect,
}: UnitPickerProps) {
  const [search, setSearch] = useState("");
  const [selectingId, setSelectingId] = useState<string | null>(null);

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

  const handleSelect = async (profile: LocalizedArmyListProfile) => {
    setSelectingId(profile.id);

    try {
      await onSelect(profile);
      onClose();
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 480,
            },
            maxWidth: "100%",
          },
        },
      }}
    >
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
                  disabled={selectingId !== null}
                  onSelect={() => void handleSelect(profile)}
                />
              ))}
            </List>
          )}
        </Box>
      </Stack>
    </Drawer>
  );
}

interface PickerRowProps {
  profile: LocalizedArmyListProfile;
  disabled: boolean;
  onSelect: () => void;
}

function PickerRow({ profile, disabled, onSelect }: PickerRowProps) {
  const points = getInitialPoints(profile);

  return (
    <ListItemButton
      disabled={disabled}
      onClick={onSelect}
      sx={{
        px: 3,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <ProfileAvatar profileId={profile.profileId} size={52} sx={{ mr: 2 }} />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {profile.profile.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {profile.tierName}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              flexShrink: 0,
              fontWeight: 700,
            }}
          >
            {points} pts
          </Typography>
        </Stack>

        {profile.profile.stats.type === "hero" && (
          <Box sx={{ mt: 1 }}>
            <UnitHeroicStats profile={profile.profile} />
          </Box>
        )}
      </Box>
    </ListItemButton>
  );
}

function getInitialPoints(profile: LocalizedArmyListProfile) {
  return (
    (profile.profile.points ?? 0) +
    profile.options
      .filter((option) => option.state === "preselected")
      .reduce((total, option) => total + (option.points ?? 0), 0)
  );
}
