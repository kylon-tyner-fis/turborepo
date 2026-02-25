// packages/shared/src/schemas/widget.ts

import { z } from "zod";

// Define specific data schemas for each widget
export const MarkdownDataSchema = z.object({
  content: z.string(),
});

export const CodeEditorDataSchema = z.object({
  content: z.string(),
  language: z.string().optional(),
});

// Create a Discriminated Union for Widgets
export const WidgetSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    slot: z.string(),
    type: z.literal("MARKDOWN_VIEWER"),
    data: MarkdownDataSchema,
  }),
  z.object({
    id: z.string(),
    slot: z.string(),
    type: z.literal("CODE_EDITOR"),
    data: CodeEditorDataSchema,
  }),
  // Add other widgets here...
]);

export type Widget = z.infer<typeof WidgetSchema>;

// Exported Widget Data Types
export type CodeEditorWidgetData = z.infer<typeof CodeEditorDataSchema>;
export type MarkdownWidgetData = z.infer<typeof MarkdownDataSchema>;

export const WidgetStateValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
]);
export type WidgetStateValue = z.infer<typeof WidgetStateValueSchema>;
