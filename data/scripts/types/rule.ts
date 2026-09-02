import type { z } from "zod";

import type {
  ruleCategorySchema,
  ruleRowSchema,
  ruleTypeSchema,
} from "../schemas";

export type RuleRow = z.infer<typeof ruleRowSchema>;
export type RuleCategory = z.infer<typeof ruleCategorySchema>;
export type RuleType = z.infer<typeof ruleTypeSchema>;

export interface Rule {
  id: string;
  category: RuleCategory;
  type?: RuleType;

  source: {
    book: string;
    page: number;
  };
}
