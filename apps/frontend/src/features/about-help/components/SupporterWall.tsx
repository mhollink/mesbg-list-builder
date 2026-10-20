import { useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  supporterTierColors,
  supporterTiers,
} from "../types/support-tiers.types";
import type { Supporter } from "~/features/about-help/types/supporter.types.ts";
import {
  getSupporterRotationKey,
  sortSupporters,
} from "~/features/about-help/utils/supporter-sorting.utils.ts";

interface SupporterWallProps {
  supporters: readonly Supporter[];
}

export function SupporterWall(props: SupporterWallProps) {
  const supporters = useMemo(
    () =>
      sortSupporters(
        props.supporters,
        getSupporterRotationKey(new Date(), "daily"),
      ),
    [props.supporters],
  );
  return (
    <>
      <SupporterTierLegend />
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {supporters.map((supporter) => (
          <Grid key={supporter.id} size={{ xs: 4, sm: 3, md: 2 }}>
            <SupporterCard supporter={supporter} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

interface SupporterCardProps {
  supporter: Supporter;
}

function SupporterCard({ supporter }: SupporterCardProps) {
  const content = (
    <Stack
      spacing={1}
      sx={{
        px: 0.5,
        py: 1,
        minWidth: 0,
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Tooltip title={supporter.tier} arrow placement="top">
        <Avatar
          src={supporter.avatarUrl}
          alt=""
          sx={{
            width: { xs: 52, md: 64 },
            height: { xs: 52, md: 64 },
            border: supporter.tier ? "3px solid" : "1px solid",
            borderColor: supporter.tier
              ? supporterTierColors[supporter.tier]
              : "divider",
            bgcolor: "action.hover",
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          {supporter.name.charAt(0).toUpperCase()}
        </Avatar>
      </Tooltip>

      <Typography
        component="span"
        variant="body2"
        sx={{
          fontWeight: 500,
          overflowWrap: "anywhere",
        }}
      >
        {supporter.name}
      </Typography>
    </Stack>
  );

  if (!supporter.profileUrl) {
    return <Box>{content}</Box>;
  }

  return (
    <Box
      component="a"
      href={supporter.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        borderRadius: 2,
        "&:hover": {
          bgcolor: "action.hover",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
        },
      }}
    >
      {content}
    </Box>
  );
}

function SupporterTierLegend() {
  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{
        flexWrap: "wrap",
      }}
    >
      {supporterTiers.map((tier) => (
        <Stack
          key={tier}
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: "center",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: supporterTierColors[tier],
              flexShrink: 0,
            }}
          />

          <Typography variant="caption" color="text.secondary">
            {tier}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
