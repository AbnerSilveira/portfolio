import { cn } from "../lib/cn";

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      {language ? (
        <div className="border-b bg-muted px-3 py-2 text-xs text-muted-foreground">
          {language}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
