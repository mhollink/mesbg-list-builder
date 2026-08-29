import type { RowComponentProps } from "react-window";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { RuleRowProps } from "../rules.types";

export function RuleListRow({
  index,
  style,
  ariaAttributes,
  rows,
  onOpenRule,
}: RowComponentProps<RuleRowProps>) {
  const row = rows[index];

  if (!row) {
    return <div style={style} {...ariaAttributes} />;
  }

  if (row.type === "letter") {
    return (
      <Box
        style={style}
        {...ariaAttributes}
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {row.letter}
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={style} {...ariaAttributes}>
      <ListItemButton
        onClick={() => onOpenRule(row.rule)}
        sx={{
          height: "100%",
          px: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <ListItemText
          primary={row.rule.name}
          slotProps={{
            primary: {
              noWrap: true,
              sx: {
                fontWeight: 500,
              },
            },
          }}
        />

        <ChevronRightRoundedIcon
          fontSize="small"
          sx={{
            ml: 2,
            color: "textSecondary",
          }}
        />
      </ListItemButton>
    </Box>
  );
}
