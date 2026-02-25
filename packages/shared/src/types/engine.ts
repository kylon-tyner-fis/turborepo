import { z } from "zod";
import { TRIGGER_TYPES } from "../constants";
import { NodeSchema } from "../schemas/node";

/**
 * 1. Widget State Value
 * Defines exactly what data a widget is allowed to emit.
 * Replaces 'any' with a safe union of primitives and structures.
 */
export const WidgetStateValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
  z.null(),
]);

export type WidgetStateValue = z.infer<typeof WidgetStateValueSchema>;

/**
 * 2. State Snapshot
 * Captures the 'Current World State' of the UI to send to the AI.
 */
export const StateSnapshotSchema = z.object({
  active_node_id: z.string(),
  widget_states: z
    .record(z.string(), WidgetStateValueSchema)
    .describe("Current value/state of each active widget"),
  user_message: z.string().optional(),
  trigger_type: z.enum(TRIGGER_TYPES),
});

export type StateSnapshot = z.infer<typeof StateSnapshotSchema>;

/**
 * 3. Engine Response
 * The 'Bouncer's' decision. Tells the UI what to show and where to go.
 */
export const EngineResponseSchema = z.object({
  simulation_output: z.object({
    terminal: z.string().optional(),
    ui_visuals: z.string().optional(),
  }),
  feedback: z.string(),
  navigation: z.object({
    should_transition: z.boolean(),
    target_node_id: z.string().nullable(),
  }),
});

export type EngineResponse = z.infer<typeof EngineResponseSchema>;

/**
 * 4. Evaluation Request (The MCP-Style Payload)
 * This combines the user's progress with the 'Rules of the Room'
 * so the AI can make an informed decision without hard-coded endpoints.
 */
export const EvaluationRequestSchema = z.object({
  snapshot: StateSnapshotSchema,
  node_context: NodeSchema, // The AI uses this to read 'simulation_rules' and 'navigation'
});

export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;
