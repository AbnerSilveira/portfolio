"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { DemoFrame } from "@portfolio/ui";

export interface MdxProps {
  code: string;
}

const mdxComponents = {
  DemoFrame,
};

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
