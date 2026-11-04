import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getUnitCost } from "../../../domain/option-rules.ts";
import { UnitLoadoutQuantityControls } from "./UnitLoadoutQuantityControls.tsx";
import {
  isSpecialUpgrade,
  toDraftUnit,
  type WarriorDraftLoadout,
} from "./unit-configuration.utils.ts";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";

interface WarriorLoadoutSelectionProps {
  profile: LocalizedArmyListProfile;
  drafts: readonly WarriorDraftLoadout[];
  disabled?: boolean;
  onChangeQuantity: (key: string, quantity: number) => void;
}

export function WarriorLoadoutSelection({
  profile,
  drafts,
  disabled = false,
  onChangeQuantity,
}: WarriorLoadoutSelectionProps) {
  const upgrades = profile.options.filter(isSpecialUpgrade);
  const compulsory = upgrades.find((option) => option.state === "preselected");
  const hasUpgrades = upgrades.length > 0;
  const quantityOnly =
    drafts.length === 1 &&
    profile.options.every((option) => option.state === "preselected");
  const groups = compulsory
    ? [compulsory.id]
    : [
        null,
        ...upgrades
          .filter((option) => option.state === "available")
          .map((option) => option.id),
      ];
  const standardCost = getUnitCost(
    toDraftUnit(profile, { optionIds: [], quantity: 1 }),
    profile,
  );

  if (drafts.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ p: 2 }}>
        No valid equipment configurations are available.
      </Typography>
    );
  }

  return (
    <>
      {groups.map((upgradeId) => {
        const entries = drafts.filter((draft) => draft.upgradeId === upgradeId);
        if (entries.length === 0) return null;
        const upgrade = upgrades.find((option) => option.id === upgradeId);
        const upgradeName =
          upgrade?.name.replace(/^upgrade to\s+/i, "") ?? "Regular Warriors";
        const upgradeCost = upgrade?.points ?? 0;

        return (
          <Stack key={upgradeId ?? "regular"} spacing={1} sx={{ p: 2 }}>
            {hasUpgrades && (
              <Stack
                direction="row"
                sx={{
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  {upgradeName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {upgrade
                    ? upgrade.state === "preselected"
                      ? "Included upgrade"
                      : `${upgradeCost > 0 ? "+" : ""}${upgradeCost} pts / model`
                    : "Without upgrade"}
                </Typography>
              </Stack>
            )}
            {entries.map((draft) => {
              const extraCost =
                getUnitCost(toDraftUnit(profile, draft), profile) -
                standardCost;
              return (
                <Stack
                  key={draft.key}
                  direction="row"
                  sx={{
                    px: 1,
                    py: 0.5,
                    gap: 1,
                    borderRadius: 1,
                    borderLeft: "3px solid",
                    borderLeftColor:
                      draft.quantity > 0 ? "primary.main" : "transparent",
                    bgcolor:
                      draft.quantity > 0 ? "action.selected" : "transparent",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="body2">
                      {quantityOnly ? "Quantity" : draft.name}
                    </Typography>
                    {!quantityOnly && (
                      <Typography variant="caption" color="textSecondary">
                        {extraCost > 0 ? "+" : ""}
                        {extraCost} pts / model
                      </Typography>
                    )}
                  </Stack>
                  <UnitLoadoutQuantityControls
                    quantity={draft.quantity}
                    minQuantity={0}
                    label={`${upgradeName}, ${draft.name}`}
                    disabled={disabled}
                    onChange={(quantity) =>
                      onChangeQuantity(draft.key, quantity)
                    }
                  />
                </Stack>
              );
            })}
            <Divider sx={{ mt: 1 }} />
          </Stack>
        );
      })}
    </>
  );
}
