import React from 'react';
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  value: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = "text",
  value,
  className
}) => {
  return (
    <div className={cn(
      "font-mono overflow-auto rounded-md border bg-slate-950 p-4 text-white",
      className
    )}>
      <pre className="text-sm">
        <code className={`language-${language}`}>
          {value}
        </code>
      </pre>
    </div>
  );
}; 