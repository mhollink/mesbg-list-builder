import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import type { Stats } from "../../profiles.types";

interface ProfileStatsProps {
  stats: Stats;
}

interface Stat {
  id: string;
  label: string;
  value: string;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const values = getStats(stats);

  const standardValues = values.filter(
    (stat) => !["might", "will", "fate"].includes(stat.id),
  );

  const heroicValues = values.filter((stat) =>
    ["might", "will", "fate"].includes(stat.id),
  );

  const hasHeroicStats = heroicValues.length > 0;

  return (
    <Box
      sx={{
        containerType: "inline-size",
        overflowX: "auto",
      }}
    >
      {/* Normal layout */}
      <Box
        sx={{
          display: "block",

          "@container (max-width: 500px)": {
            display: hasHeroicStats ? "none" : "block",
          },
        }}
      >
        <StatsTable values={values} />
      </Box>

      {/* Narrow heroic layout */}
      {hasHeroicStats && (
        <Box
          sx={{
            display: "none",

            "@container (max-width: 499px)": {
              display: "flex",
              flexDirection: "column",
              gap: 1,
            },
          }}
        >
          <StatsTable values={standardValues} />
          <StatsTable values={heroicValues} />
        </Box>
      )}
    </Box>
  );
}

function StatsTable({ values }: { values: Stat[] }) {
  return (
    <Table
      size="small"
      sx={{
        width: "100%",
        tableLayout: "fixed",
        borderTop: 1,
        borderColor: "divider",

        "& .MuiTableCell-root": {
          minWidth: 32,
          px: 1,
          py: 1,
          textAlign: "center",
          whiteSpace: "nowrap",
          borderBottom: 0,
        },
      }}
    >
      <TableHead>
        <TableRow
          sx={{
            bgcolor: "action.hover",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {values.map((stat) => (
            <TableCell
              key={stat.id}
              component="th"
              scope="col"
              sx={{ fontWeight: 700 }}
            >
              {stat.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          {values.map((stat) => (
            <TableCell key={stat.id} sx={{ fontWeight: 400 }}>
              {stat.value}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

function getStats(stats: Stats): Stat[] {
  if (stats.type === "siege") {
    return [
      {
        id: "range",
        label: "Range",
        value: stats.range,
      },
      {
        id: "strength",
        label: "Strength",
        value: stats.s,
      },
      {
        id: "defence",
        label: "Defence",
        value: stats.d,
      },
      {
        id: "wounds",
        label: "Wounds",
        value: stats.w,
      },
    ];
  }

  const standardStats: Stat[] = [
    {
      id: "movement",
      label: "Mv",
      value: stats.mv,
    },
    {
      id: "fight",
      label: "Fv",
      value: stats.fv,
    },
    {
      id: "shoot",
      label: "Sv",
      value: stats.sv,
    },
    {
      id: "strength",
      label: "S",
      value: stats.s,
    },
    {
      id: "defence",
      label: "D",
      value: stats.d,
    },
    {
      id: "attacks",
      label: "A",
      value: stats.a,
    },
    {
      id: "wounds",
      label: "W",
      value: stats.w,
    },
    {
      id: "courage",
      label: "C",
      value: stats.c,
    },
    {
      id: "intelligence",
      label: "I",
      value: stats.i,
    },
  ];

  if (stats.type === "warrior") {
    return standardStats;
  }

  return [
    ...standardStats,
    {
      id: "might",
      label: "Might",
      value: stats.might,
    },
    {
      id: "will",
      label: "Will",
      value: stats.will,
    },
    {
      id: "fate",
      label: "Fate",
      value: stats.fate,
    },
  ];
}
