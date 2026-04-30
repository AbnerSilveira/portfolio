"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

export interface NavLinkProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  /** Reservado (react-router); no App Router não há estado pending exposto aqui. */
  pendingClassName?: string;
  /**
   * Se true, só ativa com pathname exato. Se false (padrão), `/projetos` ativa em `/projetos/...`.
   */
  exact?: boolean;
}

function hrefToPathname(href: LinkProps["href"]): string {
  if (typeof href === "string") return href.split("?")[0]?.split("#")[0] ?? "/";
  return href.pathname ?? "/";
}

function isActivePath(
  href: LinkProps["href"],
  pathname: string,
  exact: boolean,
): boolean {
  const base = hrefToPathname(href);
  if (exact) return pathname === base;
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName: _pendingClassName,
      exact = false,
      href,
      ...props
    },
    ref,
  ) => {
    const pathname = usePathname();
    const active = isActivePath(href, pathname, exact);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, active && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
