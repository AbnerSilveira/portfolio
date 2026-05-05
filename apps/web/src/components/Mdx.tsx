"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { DemoFrame } from "@portfolio/ui";

import { RsaDemoFrame } from "@/components/RsaDemoFrame";

export interface MdxProps {
  code: string;
}

const mdxComponents = {
  DemoFrame,
  RsaDemoFrame,
};

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={mdxComponents} />;
}
