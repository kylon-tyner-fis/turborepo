// apps/learning/app/page.tsx
"use client";

import { useCallback, useState } from "react";
import {
  ToolNode,
  StateSnapshot,
  EngineResponse,
  WidgetStateValue,
} from "@repo/shared";
import { NodeRenderer } from "@/components/NodeRenderer";

/**
 * MOCK INITIAL DATA
 * In a production scenario, this might be passed as a prop
 * from a Server Component or fetched via a client-side library.
 */
const INITIAL_NODE: ToolNode = {
  id: "node_start",
  layout_template: "split_view",
  widgets: [
    {
      id: "instr_1",
      slot: "left",
      type: "MARKDOWN_VIEWER",
      data: {
        content:
          "# Reactivity Challenge\nReact state is asynchronous. Can you fix the counter below so it updates the UI correctly using a hook?",
      },
    },
    {
      id: "editor_1",
      slot: "right",
      type: "CODE_EDITOR",
      data: {
        content:
          "let count = 0;\n\nfunction App() {\n  return <button>{count}</button>;\n}",
        language: "javascript",
      },
    },
  ],
  navigation: [
    {
      target_node: "node_success",
      validation_objective:
        "The user has correctly replaced the let variable with the useState hook and used the setter function.",
    },
  ],
  simulation_rules:
    "Act as a React 18 compiler. If the user uses useState, simulate a successful render. If they mutate state directly, show an error.",
};

export default function LearningPage() {
  /**
   * 1. STATE MANAGEMENT
   * We initialize with the INITIAL_NODE to prevent 'cascading renders'
   * caused by setting state inside a useEffect on mount.
   */
  const [currentNode, setCurrentNode] = useState<ToolNode | null>(INITIAL_NODE);
  const [widgetStates, setWidgetStates] = useState<
    Record<string, WidgetStateValue>
  >({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  /**
   * 2. STABILIZED CALLBACK
   * We wrap this in useCallback so the identity of the function doesn't
   * change, preventing infinite loops in the Widget's useEffect.
   */
  const handleWidgetStateChange = useCallback(
    (id: string, value: WidgetStateValue) => {
      setWidgetStates((prev) => ({ ...prev, [id]: value }));
    },
    [],
  );

  /**
   * 3. THE EVALUATION TRIGGER
   * Packages the current "World State" into a Snapshot and sends it
   * to the AI Engine.
   */
  const handleSubmit = async () => {
    if (!currentNode || isEvaluating) return;

    setIsEvaluating(true);

    const snapshot: StateSnapshot = {
      active_node_id: currentNode.id,
      widget_states: widgetStates,
      trigger_type: "EXPLICIT",
    };

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      // Typed cast ensures we have full Intellisense on the AI's response
      const result = (await res.json()) as EngineResponse;

      // Handle Navigation logic
      if (
        result.navigation.should_transition &&
        result.navigation.target_node_id
      ) {
        console.log(
          "Navigating to next node:",
          result.navigation.target_node_id,
        );
        // Here you would fetch the next node JSON and call setCurrentNode
      } else {
        // Handle Feedback logic (e.g., show a toast or update a Terminal widget)
        console.log("AI Feedback:", result.feedback);
      }
    } catch (error) {
      console.error("Evaluation failed:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * 4. RENDERER
   */
  if (!currentNode) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="animate-pulse">Loading Tool Context...</p>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full bg-black text-white antialiased">
      {/* The Dynamic Layout Engine */}
      <NodeRenderer
        node={currentNode}
        onWidgetChange={handleWidgetStateChange}
      />

      {/* Persistent Interaction Overlay */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isEvaluating}
          className={`
            px-8 py-3 rounded-full font-bold transition-all shadow-2xl
            ${
              isEvaluating
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
            }
          `}
        >
          {isEvaluating ? "Evaluating..." : "Check My Work"}
        </button>
      </div>
    </main>
  );
}
