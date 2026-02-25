// apps/learning/components/layouts/SplitView.tsx
export const SplitView = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => (
  <div className="flex flex-row h-screen w-full overflow-hidden bg-black">
    <div className="flex-1 overflow-y-auto border-r border-zinc-800 p-6">
      {left}
    </div>
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">{right}</div>
  </div>
);
