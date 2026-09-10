import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function DebugKeyword({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ px: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ alignItems: "center" }}
      >
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ fontWeight: 700, minWidth: "20ch" }}
        >
          {title}
        </Typography>

        {children}
      </Stack>
    </Box>
  );
}

export function DebugSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ p: 1 }}>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        sx={{ mb: 1, fontWeight: 700 }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

export function DebugValue({ value }: { value: unknown }) {
  if (value === undefined || value === null || value === "") {
    return (
      <Typography variant="body2" color="text.disabled">
        empty
      </Typography>
    );
  }

  if (typeof value === "boolean") {
    return (
      <Chip size="small" label={value ? "true" : "false"} variant="outlined" />
    );
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {String(value)}
      </Typography>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <Typography variant="body2" color="text.disabled">
          empty
        </Typography>
      );
    }

    if (value.every(isPrimitive)) {
      return (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {value.map((entry) => (
            <Chip
              key={String(entry)}
              size="small"
              label={String(entry)}
              variant="outlined"
            />
          ))}
        </Box>
      );
    }

    return (
      <Stack spacing={1}>
        {value.map((entry) => (
          <DebugObject key={entry} value={entry} />
        ))}
      </Stack>
    );
  }

  if (typeof value === "object") {
    return <DebugObject value={value} />;
  }

  return null;
}

function DebugObject({ value }: { value: unknown }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return <DebugValue value={value} />;
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            Object.entries(value).length === 4
              ? "repeat(4, 1fr)"
              : "1fr 0.5fr 2fr",
        }}
      >
        {Object.entries(value).map(([key, childValue]) => (
          <Box key={key}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                display: "block",
                fontWeight: 700,
              }}
            >
              {humanize(key)}
            </Typography>

            <DebugValue value={childValue} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function isPrimitive(
  value: unknown,
): value is string | number | boolean | null | undefined {
  return value === null || typeof value !== "object";
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}
