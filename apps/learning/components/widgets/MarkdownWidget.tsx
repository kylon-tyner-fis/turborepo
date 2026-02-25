import ReactMarkdown from "react-markdown";

export const MarkdownWidget = ({ data }: { data: { content?: string } }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{data.content || ""}</ReactMarkdown>
    </div>
  );
};
