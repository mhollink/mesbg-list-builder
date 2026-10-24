import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { UnitLoadoutQuantityControls } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitLoadoutQuantityControls.tsx";

interface Loadout {
  name: string;
  pp: number;
  quantity: number;
}

interface UnitLoadoutSelectionProps {
  loadouts: Record<string, Loadout>;
  quantityOnly: boolean;
  handleChangeQuantity: (option: string, quantity: number) => void;
}

export function UnitLoadoutSelection({
  loadouts,
  quantityOnly,
  handleChangeQuantity,
}: UnitLoadoutSelectionProps) {
  const standardEntry = Object.entries(loadouts)[0];

  if (quantityOnly && standardEntry) {
    const [key, loadout] = standardEntry;

    return (
      <>
        <Stack
          direction="row"
          sx={{
            p: 2,
            my: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            Quantity
          </Typography>

          <UnitLoadoutQuantityControls
            quantity={loadout.quantity}
            onChange={(value) => handleChangeQuantity(key, value)}
          />
        </Stack>
        <Divider />
      </>
    );
  }

  return (
    <>
      <Stack spacing={1} sx={{ p: 2, my: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
          }}
        >
          Equipment and quantity
        </Typography>

        {Object.entries(loadouts).map(([optionId, loadout]) => (
          <Stack
            key={optionId}
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
              py: 0.75,
              borderRadius: 1,
              borderLeft: "3px solid",
              borderLeftColor:
                loadout.quantity > 0 ? "primary.main" : "transparent",
              bgcolor: (theme) =>
                loadout.quantity > 0
                  ? alpha(theme.palette.highlight.main, 0.1)
                  : "transparent",
            }}
          >
            <Stack>
              <Typography sx={{ fontWeight: 700 }}>{loadout.name}</Typography>
              <Typography color="textSecondary">
                +{loadout.pp} points
              </Typography>
            </Stack>
            <Stack>
              <UnitLoadoutQuantityControls
                quantity={loadout.quantity}
                onChange={(value) => handleChangeQuantity(optionId, value)}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Divider />
    </>
  );
}
