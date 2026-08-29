export type RuleType =
  | "special-rule"
  | "magical-power"
  | "heroic-action"
  | "brutal-power-attack";

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: RuleType;
  type?: string;
  source?: string;
}

export type RuleRow =
  | {
      key: string;
      type: "letter";
      letter: string;
    }
  | {
      key: string;
      type: "rule";
      letter: string;
      rule: Rule;
    };

export interface RuleRowProps {
  rows: RuleRow[];
  onOpenRule: (rule: Rule) => void;
}

export interface VisibleRows {
  startIndex: number;
  stopIndex: number;
}
