import type { RuleType } from "./rules.types";

export interface RuleTypeOption {
  value: RuleType;
  label: string;
}

export const RULE_TYPES: readonly RuleTypeOption[] = [
  {
    value: "special-rule",
    label: "Special rules",
  },
  {
    value: "magical-power",
    label: "Magical powers",
  },
  {
    value: "heroic-action",
    label: "Heroic actions",
  },
  {
    value: "brutal-power-attack",
    label: "Brutal power attacks",
  },
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const RULE_ROW_HEIGHT = 52;
export const LETTER_ROW_HEIGHT = 40;
