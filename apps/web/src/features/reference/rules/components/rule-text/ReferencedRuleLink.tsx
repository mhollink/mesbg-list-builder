import type { PropsWithChildren } from "react";
import Link from "@mui/material/Link";

export interface ReferencedRuleLinkProps {
  onClick: () => void;
}

export function ReferencedRuleLink({
  children,
  onClick,
}: PropsWithChildren<ReferencedRuleLinkProps>) {
  return (
    <Link
      component="button"
      type="button"
      onClick={() => onClick()}
      sx={{
        font: "inherit",
        verticalAlign: "baseline",
      }}
    >
      {children}
    </Link>
  );
}
