import type { RefObject } from "react";
import { type ListImperativeAPI, List as VirtualList } from "react-window";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { Rule, RuleRow, VisibleRows } from "../rules.types";
import { getRuleRowHeight, getRuleRowKey } from "../rules.utils";
import { RuleListRow } from "./RuleListRow";

interface RulesListProps {
  rows: RuleRow[];
  listRef: RefObject<ListImperativeAPI | null>;
  onOpenRule: (rule: Rule) => void;
  onRowsRendered: (rows: VisibleRows) => void;
}

export function RulesList({
  rows,
  listRef,
  onOpenRule,
  onRowsRendered,
}: RulesListProps) {
  if (rows.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          No rules found
        </Typography>

        <Typography
          color="textSecondary"
          sx={{
            mt: 0.5,
          }}
        >
          Try a different search term.
        </Typography>
      </Box>
    );
  }

  return (
    <VirtualList
      listRef={listRef}
      rowCount={rows.length}
      rowHeight={getRuleRowHeight}
      rowComponent={RuleListRow}
      rowProps={{
        rows,
        onOpenRule,
      }}
      rowKey={getRuleRowKey}
      overscanCount={6}
      onRowsRendered={onRowsRendered}
      style={{
        height: "100%",
      }}
    />
  );
}
