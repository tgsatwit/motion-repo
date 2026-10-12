"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "kinetic-theme";
const CHANGE_EVENT = "kinetic-theme-change";

/**
 * Applies the theme before first paint so a dark-mode reload never flashes
 * white. Kept as a string so it can be inlined in <head>.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}")||"system";var d=s==="dark"||(s==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/* The stored preference is external state, so it is read through a store
   rather than copied into component state inside an effect. */
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
}

/** The server cannot know the preference; hydration corrects it. */
function getServerSnapshot(): Theme {
  return "system";
}

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // While on "system", follow the OS as it changes.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const select = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-border bg-bg-subtle p-0.5"
    >
      {options.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => select(value)}
            className={cn(
              "relative grid size-6 place-items-center rounded-full transition-colors",
              active ? "text-fg" : "text-fg-faint hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
                className="absolute inset-0 rounded-full bg-bg-raised shadow-sm ring-1 ring-border"
              />
            )}
            <Icon className="relative size-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
