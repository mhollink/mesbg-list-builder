import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { getUnitCost, getUnitTotalCost } from "../../../domain/option-rules.ts";
import type { BuilderUnit } from "../../../domain/roster.types.ts";
import { UnitConfigurationHeader } from "./UnitConfigurationHeader.tsx";
import { UnitLoadoutSelection } from "./UnitLoadoutSelection.tsx";
import { UnitSummary } from "./UnitSummary.tsx";
import {
  createWarriorDrafts,
  normalizeOptionIds,
  toDraftUnit,
  type UnitLoadout,
  type WarriorDraftLoadout,
} from "./unit-configuration.utils.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

export interface UnitConfigurationViewProps {
  profile: LocalizedArmyListProfile;
  existingUnits?: readonly BuilderUnit[];
  onBack?: () => void;
  onClose: () => void;
  onSave: (loadouts: UnitLoadout[]) => Promise<void>;
}

export function UnitConfigurationView({
  profile,
  existingUnits = [],
  onBack,
  onClose,
  onSave,
}: UnitConfigurationViewProps) {
  const matchingUnits = existingUnits.filter(
    (unit) => unit.armyListProfileId === profile.id,
  );
  const editing = matchingUnits.length > 0;
  const isHero = profile.profile.stats.type === "hero";

  const [heroOptionIds, setHeroOptionIds] = useState<string[]>(() =>
    normalizeOptionIds(profile, matchingUnits[0]?.optionIds ?? []),
  );
  const [warriorDrafts, setWarriorDrafts] = useState<WarriorDraftLoadout[]>(
    () => createWarriorDrafts(profile, matchingUnits),
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const quantityOnly = profile.options.every(
    (option) => option.state === "preselected",
  );
  const preselectedOptions = profile.options.filter(
    (option) => option.state === "preselected",
  );
  const selectedHeroOptionCount =
    preselectedOptions.length + heroOptionIds.length;
  const heroMinimum = profile.profile.optionLimits?.min ?? 0;
  const heroMaximum = profile.profile.optionLimits?.max;
  const heroOptionsValid =
    selectedHeroOptionCount >= heroMinimum &&
    (heroMaximum === undefined || selectedHeroOptionCount <= heroMaximum);

  const currentUnits: UnitLoadout[] = isHero
    ? [{ optionIds: heroOptionIds, quantity: 1 }]
    : warriorDrafts
        .filter((draft) => draft.quantity > 0)
        .map(({ optionIds, quantity }) => ({ optionIds, quantity }));

  const models = currentUnits.reduce(
    (sum, loadout) => sum + loadout.quantity,
    0,
  );
  const points = currentUnits.reduce(
    (sum, loadout) =>
      sum + getUnitTotalCost(toDraftUnit(profile, loadout), profile),
    0,
  );
  const previousPoints = matchingUnits.reduce(
    (sum, unit) => sum + getUnitTotalCost(unit, profile),
    0,
  );
  const pointsDifference = points - previousPoints;
  const standardCost = getUnitCost(
    toDraftUnit(profile, {
      optionIds: [],
      quantity: 1,
    }),
    profile,
  );

  const displayedLoadouts = Object.fromEntries(
    warriorDrafts.map((draft) => [
      draft.key,
      {
        name: draft.name,
        pp: getUnitCost(toDraftUnit(profile, draft), profile) - standardCost,
        quantity: draft.quantity,
      },
    ]),
  );

  function changeWarriorQuantity(key: string, quantity: number) {
    setWarriorDrafts((previous) =>
      previous.map((draft) =>
        draft.key === key
          ? { ...draft, quantity: Math.max(0, quantity) }
          : draft,
      ),
    );
  }

  function toggleHeroOption(optionId: string, checked: boolean) {
    setHeroOptionIds((previous) =>
      normalizeOptionIds(
        profile,
        checked
          ? [...previous, optionId]
          : previous.filter((id) => id !== optionId),
      ),
    );
  }

  async function submit() {
    if (saving || (isHero && !heroOptionsValid) || (!editing && models === 0)) {
      return;
    }

    setSaving(true);
    setSaveError(false);

    try {
      // An empty array when editing warriors means removing all of them.
      await onSave(currentUnits);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack sx={{ height: "100%", minHeight: 0 }}>
      <UnitConfigurationHeader
        profile={profile}
        onBack={onBack}
        onClose={onClose}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pointerEvents: saving ? "none" : "auto",
        }}
      >
        <UnitSummary profile={profile} />

        {isHero ? (
          <Stack spacing={1} sx={{ p: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
              Additional equipment
            </Typography>

            {profile.options.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                This hero has no additional equipment options.
              </Typography>
            ) : (
              profile.options.map((option) => {
                const preselected = option.state === "preselected";
                const checked =
                  preselected || heroOptionIds.includes(option.id);

                return (
                  <Stack
                    key={option.id}
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1,
                      borderRadius: 1,
                      bgcolor: (theme) =>
                        checked
                          ? alpha(theme.palette.highlight.main, 0.1)
                          : "transparent",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          disabled={preselected || saving}
                          onChange={(_, next) =>
                            toggleHeroOption(option.id, next)
                          }
                        />
                      }
                      label={option.name}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ flexShrink: 0 }}
                    >
                      {preselected
                        ? "Included"
                        : `${(option.points ?? 0) > 0 ? "+" : ""}${option.points ?? 0} pts`}
                    </Typography>
                  </Stack>
                );
              })
            )}

            {!heroOptionsValid && (
              <Alert severity="warning">
                {heroMaximum === undefined
                  ? `Select at least ${heroMinimum} equipment option(s).`
                  : `Select between ${heroMinimum} and ${heroMaximum} equipment option(s).`}
              </Alert>
            )}
          </Stack>
        ) : (
          <UnitLoadoutSelection
            loadouts={displayedLoadouts}
            quantityOnly={quantityOnly}
            handleChangeQuantity={changeWarriorQuantity}
          />
        )}
      </Box>

      <Stack
        spacing={1.5}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {saveError && (
          <Alert severity="error">
            The configuration could not be saved. Your changes are still here.
          </Alert>
        )}

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>
            {editing ? "Configured models" : "Models to add"}
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>{models}</Typography>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Total points</Typography>
          <Typography sx={{ fontWeight: 700 }}>{points} pts</Typography>
        </Stack>

        {editing && (
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="textSecondary">Change</Typography>
            <Typography color="textSecondary">
              {pointsDifference > 0 ? "+" : ""}
              {pointsDifference} pts
            </Typography>
          </Stack>
        )}

        <Button
          variant="contained"
          startIcon={editing ? <SaveIcon /> : <AddIcon />}
          disabled={
            saving ||
            (isHero && !heroOptionsValid) ||
            (!editing && models === 0)
          }
          onClick={() => void submit()}
        >
          {saving
            ? "Saving..."
            : editing
              ? "Save changes"
              : isHero
                ? "Add hero"
                : `Add ${models} followers`}
        </Button>
      </Stack>
    </Stack>
  );
}
