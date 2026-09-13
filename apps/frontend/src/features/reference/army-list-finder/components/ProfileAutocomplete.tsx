import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

interface ProfileAutocompleteProps {
  profiles: LocalizedProfile[];
  selectedProfileIds: string[];
  disabled: boolean;
  onSelect: (profileId: string) => void;
}

export function ProfileAutocomplete({
  profiles,
  selectedProfileIds,
  disabled,
  onSelect,
}: ProfileAutocompleteProps) {
  const { t } = useTranslation("army-list-finder");
  const selectedIds = useMemo(
    () => new Set(selectedProfileIds),
    [selectedProfileIds],
  );

  const availableProfiles = useMemo(
    () => profiles.filter((profile) => !selectedIds.has(profile.profile)),
    [profiles, selectedIds],
  );

  return (
    <Autocomplete
      options={availableProfiles}
      value={null}
      disabled={disabled}
      getOptionLabel={(profile) => profile.name}
      isOptionEqualToValue={(option, value) => option.profile === value.profile}
      onChange={(_, profile) => {
        if (profile) {
          onSelect(profile.profile);
        }
      }}
      renderOption={(props, profile) => (
        <Box component="li" {...props} key={profile.profile}>
          <Box>
            <Typography variant="body1">{profile.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {profile.originName}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("profileSearch.label")}
          placeholder={t("profileSearch.placeholder")}
          helperText={disabled ? t("profileSearch.limitReached") : undefined}
        />
      )}
      sx={{
        maxWidth: 720,
      }}
    />
  );
}
