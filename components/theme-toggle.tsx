"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/active-theme";
import { Button } from "@/registry/hirael/ui/button";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isLight = mode === "light";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setMode(isLight ? "dark" : "light")}
    >
      <Sun
        className={cn(
          "size-3.5 transition-all duration-200",
          mounted && isLight
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute size-3.5 transition-all duration-200",
          mounted && !isLight
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
      />
    </Button>
  );
}
