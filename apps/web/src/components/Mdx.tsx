"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { DemoFrame } from "@portfolio/ui";

export interface MdxProps {
  code: string;
}

function MdxTable({ children, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-card [&_tbody_tr:last-child_td]:border-b-0">
      <table className="w-full min-w-[28rem] text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

function MdxTh({ children, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className="border-b border-border bg-muted/50 px-4 py-2.5 text-left font-mono text-xs font-medium tracking-wide text-primary uppercase"
      {...props}
    >
      {children}
    </th>
  );
}

function MdxTd({ children, ...props }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-border/50 px-4 py-3 align-top text-foreground/90"
      {...props}
    >
      {children}
    </td>
  );
}

const mdxComponents = {
  DemoFrame,
  table: MdxTable,
  th: MdxTh,
  td: MdxTd,
};

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
