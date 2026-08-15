"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { MotionGlobalConfig } from "motion/react";

/**
 * Freeze motion in gallery thumbnails (`?static=1` → `data-static`): flip
 * motion's global `skipAnimations` so infinite loops (login-03's floating
 * paths, say) render as a still instead of drifting. The globals.css freeze
 * only pins `whileInView` reveals, not motion's WAAPI `animate` loops. Set
 * during render, before any child motion effect starts. Live embeds animate.
 */
export function EmbedStaticMotion({ children }: { children: ReactNode }) {
  useState(() => {
    if (
      typeof document !== "undefined" &&
      document.documentElement.hasAttribute("data-static")
    ) {
      MotionGlobalConfig.skipAnimations = true;
    }
  });

  return <>{children}</>;
}
