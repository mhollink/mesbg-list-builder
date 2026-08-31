import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

import { useProfileDrawer } from "../../hooks/useProfileDrawer";
import { ProfileDrawerHeader } from "./ProfileDrawerHeader";
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
            <ProfileStats stats={content.profile.stats} />

            {content.additionalText && (
              <ProfileValueList
                title="Additional Information"
                values={content.additionalText}
              />
            )}

            <ProfileValueList
              title="Wargear"
              values={content.profile.wargear}
              display="inline"
            />

            <ProfileRuleLinks
              title="Special Rules"
              rules={content.specialRules}
              onOpenRule={openRule}
            />

            <ProfileProfileRules
              rules={content.profileRules}
              onOpenRule={openRule}
            />

            <ProfileRuleLinks
              title="Heroic Actions"
              rules={content.heroicActions}
              onOpenRule={openRule}
            />

            <ProfileOptions options={content.options} />

            <ProfileMagicPowers
              powers={content.magicalPowers}
              onOpenRule={openRule}
            />

            <ProfileRelatedProfiles
              profiles={content.additionalProfiles}
              onOpenProfile={openProfile}
            />
          </Stack>

          <Divider />

          <ProfileSource source={content.profile.source} />
        </Stack>
      )}
    </Drawer>
  );
}
