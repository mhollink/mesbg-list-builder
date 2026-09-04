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

  return (
    <Box
      sx={{
        overflowX: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: values.length * 32,

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
                sx={{
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            {values.map((stat) => (
              <TableCell
                key={stat.id}
                sx={{
                  fontWeight: 400,
                }}
              >
                {stat.value}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
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
