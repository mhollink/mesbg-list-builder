export type RuleType =
  | "special-rule"
  | "magical-power"
  | "heroic-action"
  | "brutal-power-attack"
  | "equipment";

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: RuleType;
  type?: string;
  source: {
    book: string;
    page: number;
  };
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
