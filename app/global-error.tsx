"use client"

import { useEffect } from "react"

const RELOAD_KEY = "hirael:global-error-reloaded-at"
const RELOAD_COOLDOWN_MS = 20000

/**
 * After a deploy the freshly purged HTML can still point a browser (or a
 * stale Cloudflare edge document) at hashed JS/CSS chunks that no longer
 * exist. Fetching a missing chunk throws one of these, which unmounts the
 * whole app and reads to the user as a blank, crashed page.
 */
function isStaleDeployError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const { name, message } = error as { name?: string; message?: string }
  if (name === "ChunkLoadError") return true
  const msg = message ?? ""
  return (
    /Loading (?:CSS )?chunk [\w-]+ failed/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  )
}

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    if (!isStaleDeployError(error)) return

    // A hard reload pulls the current HTML + chunk manifest and recovers
    // transparently. The sessionStorage cooldown stops a reload loop in case
    // reloading does not actually resolve the missing chunk.
    let lastReload = 0
    try {
      lastReload = Number(window.sessionStorage.getItem(RELOAD_KEY)) || 0
    } catch {
      /* sessionStorage can be unavailable (private mode, blocked cookies) */
    }
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return

    try {
      window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch {
      /* ignore write failures and still attempt the reload below */
    }
    window.location.reload()
  }, [error])

  // global-error replaces the root layout, so this tree renders its own
  // document and ships its own styles inline. That keeps the fallback
  // working even when the failure that triggered it was a missing CSS/JS
  // chunk, which is exactly the case we are guarding against here.
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong</title>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_ERROR_CSS }} />
      </head>
      <body className="ge-root">
        <main className="ge-main">
          <div className="ge-card">
            <svg
              className="ge-mark"
              viewBox="0 0 80 100"
              width="30"
              height="38"
              role="img"
              aria-label="Hirael"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
              <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
              <path d="M22 86 H58" opacity="0.7" />
              <path d="M28 92 H52" opacity="0.45" />
              <path d="M34 96 H46" opacity="0.25" />
            </svg>

            <p className="ge-eyebrow">Something went wrong</p>
            <h1 className="ge-title">This page failed to load.</h1>
            <p className="ge-text">
              A new version may have just shipped. Reloading the page usually
              clears it up.
            </p>

            <div className="ge-actions">
              <button
                type="button"
                className="ge-btn ge-btn-primary"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
              {/* A plain anchor (not next/link) forces a full document load,
                  which is the whole point here: client navigation would
                  re-fetch the same missing chunks and fail again. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className="ge-btn ge-btn-secondary" href="/">
                Back to home
              </a>
            </div>

            {error?.digest ? (
              <p className="ge-ref">Reference: {error.digest}</p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  )
}

const GLOBAL_ERROR_CSS = `
.ge-root {
  margin: 0;
  min-height: 100vh;
  background: #09090b;
  color: #fafafa;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ge-main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.ge-card {
  width: 100%;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
}
.ge-mark {
  opacity: 0.9;
}
.ge-eyebrow {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #a1a1aa;
}
.ge-title {
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.ge-text {
  margin: 0;
  max-width: 24rem;
  font-size: 14px;
  line-height: 1.6;
  color: #a1a1aa;
}
.ge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 4px;
}
.ge-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    opacity 0.15s ease;
}
.ge-btn:focus-visible {
  outline: 2px solid #71717a;
  outline-offset: 2px;
}
.ge-btn-primary {
  background: #fafafa;
  color: #18181b;
}
.ge-btn-primary:hover {
  opacity: 0.9;
}
.ge-btn-secondary {
  background: transparent;
  color: #fafafa;
  border-color: #27272a;
}
.ge-btn-secondary:hover {
  background: #18181b;
  border-color: #3f3f46;
}
.ge-ref {
  margin: 4px 0 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: #52525b;
  word-break: break-all;
}
@media (prefers-color-scheme: light) {
  .ge-root {
    background: #ffffff;
    color: #18181b;
  }
  .ge-eyebrow,
  .ge-text {
    color: #71717a;
  }
  .ge-btn-primary {
    background: #18181b;
    color: #fafafa;
  }
  .ge-btn-secondary {
    color: #18181b;
    border-color: #e4e4e7;
  }
  .ge-btn-secondary:hover {
    background: #f4f4f5;
    border-color: #d4d4d8;
  }
  .ge-ref {
    color: #a1a1aa;
  }
}
`
