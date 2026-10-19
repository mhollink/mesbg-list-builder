import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { UnitLoadoutQuantityControls } from "~/features/armies/rosters/builder/components/pickers/unit-configuration/UnitLoadoutQuantityControls.tsx";

interface Loadout {
  name: string;
  pp: number;
  quantity: number;
}

interface UnitLoadoutSelectionProps {
  loadouts: Record<string, Loadout>;
  handleChangeQuantity: (option: string, quantity: number) => void;
}

export function UnitLoadoutSelection({
  loadouts,
  handleChangeQuantity,
}: UnitLoadoutSelectionProps) {
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
