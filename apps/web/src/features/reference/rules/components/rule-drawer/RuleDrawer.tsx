import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useRuleDrawer } from "../../hooks/useRuleDrawer.ts";
import { useAppDispatch } from "~/app/store/hooks.ts";
import { openRuleDrawer } from "~/app/store/uiSlice.ts";
import { RuleText } from "~/features/reference/rules/components/rule-text/RuleText.tsx";
import type { Rule } from "~/features/reference/rules/rules.types.ts";
import {useTranslation} from "react-i18next";

export function RuleDrawer() {
  const dispatch = useAppDispatch();
  const { open, rule, close, canGoBack, goBack } = useRuleDrawer();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 620,
              md: 760,
            },
            maxWidth: "100%",
          },
        },
      }}
    >
      {rule && (
        <Stack sx={{ minHeight: "100%" }}>
          <RuleDrawerHeader
            rule={rule}
            onClose={close}
            onBack={goBack}
            canGoBack={canGoBack}
          />

          <Divider />

          <Box
            sx={{
              flex: 1,
              px: {
                xs: 2.5,
                sm: 4,
              },
              py: 3,
            }}
          >
            <RuleText
              onRuleClick={(ruleId) => dispatch(openRuleDrawer(ruleId))}
            >
              {rule.description}
            </RuleText>
          </Box>

          <Divider />

          <RuleSource source={rule.source} />
        </Stack>
      )}
    </Drawer>
  );
}

interface RuleDrawerHeaderProps {
  rule: Rule;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
}

function RuleDrawerHeader({
  rule,
  onClose,
  canGoBack,
  onBack,
}: RuleDrawerHeaderProps) {
  return (
    <Box
      sx={{
        px: {
          xs: 2.5,
          sm: 4,
        },
        pt: 3,
        pb: 2.5,
      }}
    >
      <Stack
        direction="row"
        sx={{
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {canGoBack && (
          <IconButton
            onClick={onBack}
            aria-label="Back to previous item"
            sx={{
              mt: -0.5,
              ml: -1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="overline"
            color="textSecondary"
            sx={{
              display: "block",
              mb: 0.5,
              fontWeight: 700,
            }}
          >
            {getCategoryLabel(rule.category)}
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {rule.name}
          </Typography>

          {rule.type && (
            <Chip
              label={getTypeLabel(rule.type)}
              size="small"
              variant="outlined"
              sx={{
                mt: 1.5,
              }}
            />
          )}
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Close rule details"
          sx={{
            mt: -0.5,
            mr: -1,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

interface RuleSourceProps {
  source: Rule["source"]
}

function RuleSource({ source }: RuleSourceProps) {
    const { t } = useTranslation("game-data", {keyPrefix: "books"});

    return (
    <Box
      sx={{
        px: {
          xs: 2.5,
          sm: 4,
        },
        py: 2.5,
        bgcolor: "action.hover",
      }}
    >
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          display: "block",
          fontWeight: 700,
          mb: 0.25,
        }}
      >
        Source
      </Typography>

      <Typography variant="body2" color="textSecondary">
        {t(source.book)} (page {source.page})
      </Typography>
    </Box>
  );
}

function getCategoryLabel(category: Rule["category"]): string {
  switch (category) {
    case "special-rule":
      return "Special Rule";

    case "heroic-action":
      return "Heroic Action";

    case "magical-power":
      return "Magical Power";

    case "brutal-power-attack":
      return "Brutal Power Attack";

    case "equipment":
      return "Equipment";
  }
}

function getTypeLabel(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
