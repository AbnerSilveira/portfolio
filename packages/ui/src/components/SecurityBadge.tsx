import { cn } from "../lib/cn";

export type SecuritySeverity = "low" | "medium" | "high" | "critical";

export interface SecurityBadgeProps {
  severity: SecuritySeverity;
  label?: string;
  className?: string;
}

const severityStyles: Record<SecuritySeverity, string> = {
  low: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200",
  critical: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200",
};

export function SecurityBadge({
  severity,
  label,
  className,
}: SecurityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        severityStyles[severity],
        className,
      )}
    >
      {label ?? severity}
    </span>
  );
}
