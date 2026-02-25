// packages/shared/src/schemas/node.ts
import { z } from "zod";
import { LAYOUT_TEMPLATES } from "../constants";
import { WidgetSchema } from "./widget";

export const EdgeSchema = z.object({
  target_node: z.string(),
  validation_objective: z
    .string()
    .describe("The semantic goal for the AI to verify"),
});

export const NodeSchema = z.object({
  id: z.string(),
  layout_template: z.enum(LAYOUT_TEMPLATES),
  widgets: z.array(WidgetSchema),
  navigation: z.array(EdgeSchema),
  simulation_rules: z
    .string()
    .optional()
    .describe("Rules for the AI-simulated runtime"),
});

export type ToolNode = z.infer<typeof NodeSchema>;
