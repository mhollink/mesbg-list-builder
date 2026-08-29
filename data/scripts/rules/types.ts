import type { z } from "zod";

import type { ruleCategorySchema, ruleTypeSchema } from "./schemas.ts";

export type Rule = {
  id: string;
  category: z.infer<typeof ruleCategorySchema>;
  type?: z.infer<typeof ruleTypeSchema>;
  source?: string;
};
