import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import type { BuilderRoster } from "../../domain/roster.types.ts";
import { useRosterBuilder } from "../../hooks/useRosterBuilder.ts";
import type { RosterPersistence } from "../../persistence/roster-persistence.types.ts";
import { WarbandList } from "../warbands/WarbandList.tsx";
import {
  ROSTER_INFO_PANEL_WIDTH,
  RosterInfoPanel,
} from "./info-panel/RosterInfoPanel.tsx";
import { RosterBuilderHeader } from "./RosterBuilderHeader.tsx";
import { MobileRosterSummary } from "~/features/armies/rosters/builder/components/layout/MobileRosterSummary.tsx";

interface RosterBuilderProps {
  roster: BuilderRoster;
  persistence: RosterPersistence;
}

export function RosterBuilder({ roster, persistence }: RosterBuilderProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const builder = useRosterBuilder(roster, persistence);

  if (!builder.gameData || !builder.statistics) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          pr: {
            lg: `${ROSTER_INFO_PANEL_WIDTH}px`,
          },
          pb: {
            xs: 11,
            lg: 0,
          },
        }}
      >
        <Stack spacing={3}>
          <RosterBuilderHeader roster={builder.roster} />
          <MobileRosterSummary
            roster={builder.roster}
            statistics={builder.statistics}
            issueCount={builder.issues?.length ?? 0}
            onClick={() => setInfoOpen(true)}
          />

          <WarbandList
            roster={builder.roster}
            gameData={builder.gameData}
            canAddWarband={builder.canAddWarband}
            getWarbandCapacity={builder.getWarbandCapacity}
            actions={builder.actions}
          />
        </Stack>
      </Box>

      <RosterInfoPanel
        roster={builder.roster}
        armyList={builder.gameData.armyList}
        statistics={builder.statistics}
        issueCount={builder.issues?.length ?? 0}
        mobileOpen={infoOpen}
        onMobileClose={() => setInfoOpen(false)}
      />
    </>
  );
}
