import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

import { useProfileDrawer } from "../../hooks/useProfileDrawer";
import { ProfileDrawerHeader } from "./ProfileDrawerHeader";
import { ProfileHeroicStats } from "./ProfileHeroicStats";
import { ProfileKeywords } from "./ProfileKeywords";
import { ProfileMagicPowers } from "./ProfileMagicPowers";
import { ProfileOptions } from "./ProfileOptions";
import { ProfileProfileRules } from "./ProfileProfileRules";
import { ProfileRelatedProfiles } from "./ProfileRelatedProfiles";
import { ProfileRuleLinks } from "./ProfileRuleLinks";
import { ProfileSource } from "./ProfileSource";
import { ProfileStats } from "./ProfileStats";
import { ProfileValueList } from "./ProfileValueList";

export function ProfileDrawer() {
  const { open, content, close, canGoBack, goBack, openRule, openProfile } =
    useProfileDrawer();

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
      {content && (
        <Stack sx={{ minHeight: "100%" }}>
          <ProfileDrawerHeader
            profile={content.profile}
            unitTypes={content.unitTypes}
            races={content.races}
            canGoBack={canGoBack}
            onBack={goBack}
            onClose={close}
          />

          <Divider />

          <Stack
            sx={{
              flex: 1,
              gap: 4,
              px: {
                xs: 2.5,
                sm: 4,
              },
              py: 3,
            }}
          >
            <Box>
              <ProfileStats stats={content.profile.stats} />

              <ProfileHeroicStats stats={content.profile.stats} />
            </Box>

            <ProfileKeywords factions={content.factions} />

            <ProfileValueList title="Wargear" values={content.wargear} />

            <ProfileRuleLinks
              title="Heroic Actions"
              rules={content.heroicActions}
              onOpenRule={openRule}
            />

            <ProfileRuleLinks
              title="Special Rules"
              rules={content.specialRules}
              onOpenRule={openRule}
            />

            <ProfileMagicPowers
              powers={content.magicalPowers}
              onOpenRule={openRule}
            />

            <ProfileProfileRules
              rules={content.profileRules}
              onOpenRule={openRule}
            />

            <ProfileOptions options={content.options} />

            <ProfileRelatedProfiles
              profiles={content.additionalProfiles}
              onOpenProfile={openProfile}
            />

            {content.profile.additionalText && (
              <ProfileValueList
                title="Additional Information"
                values={content.profile.additionalText}
              />
            )}
          </Stack>

          <Divider />

          <ProfileSource source={content.profile.source} />
        </Stack>
      )}
    </Drawer>
  );
}
