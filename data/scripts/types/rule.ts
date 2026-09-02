import type {z} from "zod";
import {ruleRowSchema} from "../schemas";

export type Rule = z.infer<typeof ruleRowSchema>