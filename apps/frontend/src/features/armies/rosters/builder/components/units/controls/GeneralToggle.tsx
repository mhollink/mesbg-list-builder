import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CrownIcon from "~/components/decorations/CrownIcon.tsx";
import IconButton from "~/components/icon-button";

export interface GeneralToggleProps {
  isGeneral: boolean;
  isFixedGeneral: boolean;
  onSetGeneral: (value: boolean) => void;
}

export function GeneralToggle({
  isGeneral,
  isFixedGeneral,
  onSetGeneral,
}: GeneralToggleProps) {
  return (
    <Tooltip title={isGeneral ? "Army General" : "Set as General"}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
        <IconButton
          size="small"
          aria-label={isGeneral ? "Army General" : "Set as General"}
          aria-pressed={isGeneral}
          disabled={isFixedGeneral}
          onClick={() => onSetGeneral(!isGeneral)}
          tone={isGeneral ? "success" : "default"}
          filled
        >
          <CrownIcon fontSize="small" />
        </IconButton>
        <Typography
          color={isGeneral ? "success" : "inherit"}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {isGeneral ? "Army General" : "Set as General"}
        </Typography>
      </Stack>
    </Tooltip>
  );
}
