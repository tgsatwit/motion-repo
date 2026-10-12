import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/cn";

const variants = {
  note: { Icon: Info, className: "border-border bg-bg-subtle", iconClass: "text-fg-faint" },
  tip: { Icon: Lightbulb, className: "border-accent/25 bg-accent-soft", iconClass: "text-accent" },
  warning: {
    Icon: AlertTriangle,
    className: "border-amber-500/25 bg-amber-500/8",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    Icon: OctagonAlert,
    className: "border-red-500/25 bg-red-500/8",
    iconClass: "text-red-600 dark:text-red-400",
  },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
}) {
  const { Icon, className, iconClass } = variants[type];
  return (
    <div className={cn("my-5 flex gap-3 rounded-xl border p-4", className)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-fg-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {title && <p className="mb-1 font-medium text-fg">{title}</p>}
        {children}
      </div>
    </div>
  );
}
