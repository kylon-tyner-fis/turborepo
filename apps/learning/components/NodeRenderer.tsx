// apps/learning/components/NodeRenderer.tsx
"use client";

import { ToolNode, Widget, WidgetStateValue } from "@repo/shared";
import { MarkdownWidget } from "./widgets/MarkdownWidget";
import { CodeEditorWidget } from "./widgets/CodeEditorWidget";
import { SplitView } from "./layouts/SplitView";

interface NodeRendererProps {
  node: ToolNode;
  // Use the specific state type instead of any
  onWidgetChange: (id: string, value: WidgetStateValue) => void;
}

export const NodeRenderer = ({ node, onWidgetChange }: NodeRendererProps) => {
  const renderWidget = (widget: Widget) => {
    // TypeScript now knows exactly what 'widget.data' contains based on 'widget.type'
    switch (widget.type) {
      case "MARKDOWN_VIEWER":
        return (
          <MarkdownWidget
            key={widget.id}
            data={widget.data} // Typed as { content: string }
          />
        );

      case "CODE_EDITOR":
        return (
          <CodeEditorWidget
            key={widget.id}
            id={widget.id}
            data={widget.data} // Typed as { content: string; language?: string }
            onStateChange={onWidgetChange}
          />
        );

      default:
        // This acts as an exhaustiveness check
        const _exhaustiveCheck: never = widget;
        return _exhaustiveCheck;
    }
  };

  // Helper to filter and map
  const getWidgetsForSlot = (slotName: string) =>
    node.widgets.filter((w) => w.slot === slotName).map(renderWidget);

  const leftWidgets = getWidgetsForSlot("left");
  const rightWidgets = getWidgetsForSlot("right");
  const mainWidgets = getWidgetsForSlot("main");

  switch (node.layout_template) {
    case "split_view":
      return <SplitView left={leftWidgets} right={rightWidgets} />;

    case "focus_view":
      return <div className="max-w-4xl mx-auto p-8">{mainWidgets}</div>;

    default:
      return (
        <div className="p-20 text-center">
          <h1 className="text-2xl font-bold">Error: Layout Not Found</h1>
        </div>
      );
  }
};
