import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import type { BuilderRoster } from "../../../domain/roster.types";
import type { BuilderRosterStatistics } from "../../../domain/roster-statistics";
import { RosterInfoHeader } from "~/features/armies/rosters/builder/components/layout/info-panel/RosterInfoHeader.tsx";
import { RosterOverview } from "~/features/armies/rosters/builder/components/layout/info-panel/RosterOverview.tsx";
import { RulesSection } from "~/features/armies/rosters/builder/components/layout/info-panel/RulesSection.tsx";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack";
import type { LocalizedArmyList } from "~/features/reference/army-lists/army-lists.types";

export interface RosterInfoContentProps {
  roster: BuilderRoster;
  armyList: LocalizedArmyList;
  statistics: BuilderRosterStatistics;
  issueCount: number;

  onClose?: () => void;
}

export function RosterInfoContent({
  roster,
  armyList,
  statistics,
  issueCount,
  onClose,
}: RosterInfoContentProps) {
  const { openRuleDrawer } = useDrawerStack();

  return (
    <Stack sx={{ minHeight: "100%", overflowY: "auto" }}>
      <RosterInfoHeader roster={roster} armyList={armyList} onClose={onClose} />

      <Divider />

      <Box>
        <RosterOverview
          roster={roster}
          statistics={statistics}
          issueCount={issueCount}
        />

        {armyList.additionalRules.length > 0 && (
          <>
            <Divider />

            <RulesSection
              title="Additional rules"
              rules={armyList.additionalRules}
              onRuleClick={openRuleDrawer}
            />
          </>
        )}

        {armyList.specialRules.length > 0 && (
          <>
            <Divider />

            <RulesSection
              title="Special rules"
              rules={armyList.specialRules}
              onRuleClick={openRuleDrawer}
            />
          </>
        )}
      </Box>
    </Stack>
  );
}
