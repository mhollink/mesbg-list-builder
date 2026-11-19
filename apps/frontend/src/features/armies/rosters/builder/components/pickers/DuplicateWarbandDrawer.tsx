import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

import type { BuilderGameData } from "../../data/builder-game-data.types.ts";
import { isUniqueProfile } from "../../domain/profile-selection.ts";
import type { BuilderWarband } from "../../domain/roster.types.ts";
import { useBuilderPickerHistory } from "../../hooks/useBuilderPickerHistory.ts";
import { UnitConfigurationView } from "./unit-configuration/UnitConfigurationView.tsx";
import type { UnitLoadout } from "./unit-configuration/unit-configuration.utils.ts";
import { UnitSelectionView } from "./unit-picker/UnitSelectionView.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface DuplicateWarbandDrawerProps {
  open: boolean;
  profiles: readonly LocalizedArmyListProfile[];
  onSave: (
    profile: LocalizedArmyListProfile,
    loadouts: UnitLoadout[],
  ) => Promise<void>;
  sourceWarband?: BuilderWarband;
  gameData: BuilderGameData;
}

export function DuplicateWarbandDrawer({
  open,
  profiles,
  onSave,
  sourceWarband,
  gameData,
}: DuplicateWarbandDrawerProps) {
  const { close } = useBuilderPickerHistory();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 680 },
            maxWidth: "100%",
          },
        },
      }}
    >
      {open && sourceWarband && (
        <DuplicateWarbandDrawerContent
          key={sourceWarband.id}
          profiles={profiles}
          sourceWarband={sourceWarband}
          gameData={gameData}
          onSave={onSave}
          onClose={close}
        />
      )}
    </Drawer>
  );
}

interface DuplicateWarbandDrawerContentProps {
  profiles: readonly LocalizedArmyListProfile[];
  sourceWarband: BuilderWarband;
  gameData: BuilderGameData;
  onSave: DuplicateWarbandDrawerProps["onSave"];
  onClose: () => void;
}

function DuplicateWarbandDrawerContent({
  profiles,
  sourceWarband,
  gameData,
  onSave,
  onClose,
}: DuplicateWarbandDrawerContentProps) {
  const originalLeader = gameData.armyListProfilesById.get(
    sourceWarband.leader.armyListProfileId,
  );
  const originalLeaderIsUnique =
    originalLeader !== undefined && isUniqueProfile(originalLeader);

  // Unique leaders are already excluded from the available profiles.
  const initialLeader = profiles.find(
    (profile) => profile.id === originalLeader?.id,
  );

  const [selectedProfileId, setSelectedProfileId] = useState(initialLeader?.id);
  const [selectingLeader, setSelectingLeader] = useState(
    initialLeader === undefined,
  );

  const selectedProfile = profiles.find(
    (profile) => profile.id === selectedProfileId,
  );

  const excludedFollowers = sourceWarband.followers.flatMap((follower) => {
    const profile = gameData.armyListProfilesById.get(
      follower.armyListProfileId,
    );

    return profile && isUniqueProfile(profile)
      ? [{ id: follower.id, name: profile.profile.name }]
      : [];
  });

  const notices =
    (originalLeaderIsUnique && !selectedProfile) ||
    excludedFollowers.length > 0 ? (
      <Stack spacing={1} sx={{ p: 2 }}>
        {originalLeaderIsUnique && !selectedProfile && (
          <Alert severity="warning">
            The original leader is Unique and cannot be duplicated. Select
            another leader to continue.
          </Alert>
        )}

        {excludedFollowers.length > 0 && (
          <Alert severity="info">
            The following Unique followers will not be copied:
            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
              {excludedFollowers.map((follower) => (
                <li key={follower.id}>{follower.name}</li>
              ))}
            </Box>
          </Alert>
        )}
      </Stack>
    ) : undefined;

  async function handleSave(loadouts: UnitLoadout[]) {
    if (
      !selectedProfile ||
      loadouts.length !== 1 ||
      loadouts[0].quantity !== 1
    ) {
      throw new Error("A warband requires exactly one leader.");
    }

    await onSave(selectedProfile, loadouts);
    onClose();
  }

  return (
    <Box sx={{ height: "100%", minHeight: 0 }}>
      {selectingLeader || !selectedProfile ? (
        <UnitSelectionView
          title="Select leader"
          profiles={profiles}
          notice={notices}
          onClose={onClose}
          onSelect={(profile) => {
            setSelectedProfileId(profile.id);
            setSelectingLeader(false);
          }}
        />
      ) : (
        <UnitConfigurationView
          key={selectedProfile.id}
          title="Duplicate warband"
          profile={selectedProfile}
          initialOptionIds={
            selectedProfile.id === originalLeader?.id
              ? sourceWarband.leader.optionIds
              : undefined
          }
          notice={notices}
          submitLabel="Duplicate warband"
          errorMessage="The warband could not be duplicated. Please try again."
          onBack={() => setSelectingLeader(true)}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}
