import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import {
  formatIssueCount,
  formatPoints,
} from "~/features/armies/rosters/builder/builder.utils.ts";
import type { BuilderRoster } from "~/features/armies/rosters/builder/domain/roster.types.ts";
import type { BuilderRosterStatistics } from "~/features/armies/rosters/builder/domain/roster-statistics.ts";

interface RosterOverviewProps {
  roster: BuilderRoster;
  statistics: BuilderRosterStatistics;
  issueCount: number;
}

export function RosterOverview({
  roster,
  statistics,
  issueCount,
}: RosterOverviewProps) {
  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{
          display: "block",
          mb: 1.5,
          fontWeight: 700,
        }}
      >
        Overview
      </Typography>

      <Table
        size="small"
        aria-label="Roster overview"
        sx={{
          "& td": {
            borderBottom: 0,
            px: 0,
            py: 0.65,
          },
        }}
      >
        <TableBody>
          <StatisticRow
            label="Points"
            value={formatPoints(roster, statistics)}
          />

          <StatisticRow label="Models" value={statistics.modelCount} />

          <StatisticRow label="Warbands" value={statistics.warbandCount} />

          <StatisticRow label="Might" value={statistics.might} />

          <StatisticRow label="Bows" value={statistics.bowCount} />

          <StatisticRow
            label="Throwing weapons"
            value={statistics.throwingWeaponCount}
          />

          <StatisticRow
            label="Issues"
            value={formatIssueCount(issueCount)}
            warning={issueCount > 0}
          />
        </TableBody>
      </Table>
    </Box>
  );
}

interface StatisticRowProps {
  label: string;
  value: string | number;
  warning?: boolean;
}

function StatisticRow({ label, value, warning = false }: StatisticRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Typography
          variant="body2"
          color={warning ? "warning.main" : "text.primary"}
          sx={{
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
