// packages/shared/src/constants.ts

export const WIDGET_TYPES = [
  "MARKDOWN_VIEWER",
  "CODE_EDITOR",
  "QUIZ_MODULE",
  "SIMULATED_TERMINAL",
  "PREVIEW_WINDOW",
] as const;

export const LAYOUT_TEMPLATES = [
  "split_view",
  "focus_view",
  "ide_layout",
  "dashboard",
] as const;

export const TRIGGER_TYPES = ["EXPLICIT", "NARRATIVE", "IDLE"] as const;
