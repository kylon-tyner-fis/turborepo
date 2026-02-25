// packages/shared/src/schemas/graph.ts
import { z } from "zod";
import { NodeSchema } from "./node";

export const ToolGraphSchema = z.object({
  tool_id: z.string(),
  title: z.string(),
  description: z.string(),
  nodes: z.array(NodeSchema),
});

export type ToolGraph = z.infer<typeof ToolGraphSchema>;
