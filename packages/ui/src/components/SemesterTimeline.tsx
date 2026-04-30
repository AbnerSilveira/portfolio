"use client";

import { useMemo, useState } from "react";
import { cn } from "../lib/cn";

export interface SemesterTimelineItem {
  semester: string;
  title: string;
  description?: string;
  href?: string;
}

export interface SemesterTimelineProps {
  items: SemesterTimelineItem[];
  className?: string;
  defaultSemester?: string;
}

export function SemesterTimeline({
  items,
  className,
  defaultSemester,
}: SemesterTimelineProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, SemesterTimelineItem[]>();
    for (const item of items) {
      const arr = map.get(item.semester) ?? [];
      arr.push(item);
      map.set(item.semester, arr);
    }
    const semesters = [...map.keys()].sort();
    return { map, semesters };
  }, [items]);

  const [activeSemester, setActiveSemester] = useState<string>(
    defaultSemester ?? grouped.semesters.at(-1) ?? "all",
  );

  const visibleItems =
    activeSemester === "all" ? items : (grouped.map.get(activeSemester) ?? []);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSemester("all")}
          className={cn(
            "rounded-lg border px-3 py-1 text-sm",
            activeSemester === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted",
          )}
        >
          Todos
        </button>
        {grouped.semesters.map((semester) => (
          <button
            key={semester}
            type="button"
            onClick={() => setActiveSemester(semester)}
            className={cn(
              "rounded-lg border px-3 py-1 text-sm",
              activeSemester === semester
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {semester}
          </button>
        ))}
      </div>

      <ol className="space-y-4">
        {visibleItems.map((item) => {
          const content = (
            <>
              <div className="text-sm text-muted-foreground">
                {item.semester}
              </div>
              <div className="font-medium">{item.title}</div>
              {item.description ? (
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              ) : null}
            </>
          );

          return (
            <li
              key={`${item.semester}-${item.title}`}
              className="rounded-lg border border-border bg-background p-4"
            >
              {item.href ? (
                <a href={item.href} className="block hover:text-primary">
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
