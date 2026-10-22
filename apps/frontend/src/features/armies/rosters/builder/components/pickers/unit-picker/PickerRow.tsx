import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileAvatar } from "~/components/profile-avatar/ProfileAvatar.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface PickerRowProps {
  profile: LocalizedArmyListProfile;
  onSelect: () => void;
  onQuickAdd?: () => Promise<void>;
}

export function PickerRow({ profile, onSelect, onQuickAdd }: PickerRowProps) {
  const [saving, setSaving] = useState(false);
  const [quickAddError, setQuickAddError] = useState(false);

  const handleQuickAdd = async () => {
    if (saving) return;
    if (onQuickAdd === undefined) {
      throw new Error(
        "Should only allow quick add when the function is assigned.",
      );
    }

    setSaving(true);
    setQuickAddError(false);

    try {
      await onQuickAdd();
    } catch {
      setQuickAddError(true);
    } finally {
      setSaving(false);
    }
  };

  const points = getInitialPoints(profile);

  return (
    <ListItemButton onClick={onSelect} sx={{ px: 3, py: 1.5 }}>
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
        {profile.profile.stats.type !== "warrior" && onQuickAdd && (
          <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
            <Box
              sx={{ display: "inline-flex" }}
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                variant="text"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={handleQuickAdd}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  justifyContent: "flex-start",
                  p: 0,
                }}
              >
                {saving ? "Adding..." : "Add without extra options"}
              </Button>
            </Box>

            {quickAddError && (
              <Typography variant="caption" color="error" role="alert">
                Could not add this profile. Please try again.
              </Typography>
            )}
          </Stack>
        )}{" "}
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
