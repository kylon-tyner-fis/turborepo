// apps/learning/components/widgets/CodeEditorWidget.tsx
"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { CodeEditorWidgetData } from "@repo/shared";

interface CodeEditorProps {
  id: string; // The widget ID from the JSON
  data: CodeEditorWidgetData;
  onStateChange: (id: string, value: string) => void;
}

export const CodeEditorWidget = ({
  id,
  data,
  onStateChange,
}: CodeEditorProps) => {
  const [code, setCode] = useState(data.content || "");

  // Inform the parent/engine of the initial state
  useEffect(() => {
    onStateChange(id, code);
  }, [id, code, onStateChange]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    // In a real app, you might debounce this call
    onStateChange(id, newCode);
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between">
        <span>{data.language?.toUpperCase() || "PLAINTEXT"}</span>
        <span>{id}</span>
      </div>
      <div className="grow">
        <Editor
          height="100%"
          defaultLanguage={data.language || "javascript"}
          defaultValue={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
