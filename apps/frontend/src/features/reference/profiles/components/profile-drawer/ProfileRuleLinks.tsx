import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProfileSection } from "./ProfileSection";
import type { ProfileDrawerRuleLink } from "./profile-drawer.types";

interface ProfileRuleLinksProps {
  title: string;
  rules: ProfileDrawerRuleLink[];
  onOpenRule: (ruleId: string) => void;
}

export function ProfileRuleLinks({
  title,
  rules,
  onOpenRule,
}: ProfileRuleLinksProps) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <ProfileSection title={title}>
      <Stack sx={{ gap: 0.25 }}>
        {rules.map((rule) => (
          <ButtonBase
            key={rule.id}
            onClick={() => onOpenRule(rule.id)}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              borderRadius: 1,
              px: 1,
              py: 0.75,
              mx: -1,

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Typography
              sx={{
                flex: 1,
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {rule.name}
            </Typography>

            <ChevronRightRoundedIcon
              fontSize="small"
              sx={{
                ml: 1,
                color: "textSecondary",
              }}
            />
          </ButtonBase>
        ))}
      </Stack>
    </ProfileSection>
  );
}
