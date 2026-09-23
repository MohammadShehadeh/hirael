# scripts

Build pipeline for the registry. `registry/hirael/registry-meta.ts` is the
single source of truth; everything below derives from it and is git-ignored.

| Command               | Script                                     | Reads                                          | Writes                                    |
| --------------------- | ------------------------------------------ | ---------------------------------------------- | ----------------------------------------- |
| `pnpm registry:gen`   | `build-registry.mts`                       | `registry-meta.ts`, item source                | `registry.json`, `registry.base.json`     |
|                       | `build-llms.mts`                           | `registry-meta.ts`                             | `public/llms.txt`                         |
| `pnpm registry:props` | `extract-props.mts`                        | component source (Radix tree)                  | `registry/hirael/registry-props.json`     |
| `pnpm check:registry` | `check-registry.mts`                       | `registry-meta.ts`, both base trees            | nothing (exits 1 on problems)             |
| `pnpm registry:build` | `shadcn build` ×2, then `stamp-source.mts` | `registry*.json`, item source                  | `public/r/*.json`, `public/r/base/*.json` |
| `pnpm registry:md`    | `build-markdown.mts`                       | item source, examples, `registry-props.json`   | `public/r/*.md`, `public/r/base/*.md`     |
| `pnpm check:install`  | `check-install.mts`                        | `public/r/**/*.json` (rebuilds first)          | nothing (exits 1 on problems)             |
| `pnpm check:health`   | `check-health.mts`                         | `public/r/**/*.json` (rebuilds first), network | nothing (exits 1 on problems)             |

Order matters, and `package.json` encodes it:

- `pnpm build`: `registry:gen`, `registry:props`, `check:registry`,
  `registry:build`, `registry:md`, then `next build`.
- `pnpm install` (via `prepare`): `registry:gen`, `registry:props`,
  `registry:md`, so a fresh clone can `dev` and `typecheck` right away.
- CI runs `check:registry` and `check:install`. `check:health` needs network
  (the CLI resolves shadcn primitives from ui.shadcn.com), so it runs locally
  before a PR: `pnpm check:health --changed` dry-runs the items your branch
  touches plus their dependents. The header of `check-health.mts` lists every
  flag.

Each script opens with a comment saying what it does. Check scripts report
every failure and exit 1 at the end, so one run lists every problem.

`shared.mts` holds what more than one script needs: repo paths, the brand
fields read from `package.json`, the entry list with the showcased/
distribution-only split, the source header, and the pass/fail reporter.
`REGISTRY_BASE_URL` (default: `package.json` `homepage`) is the host every
generated URL points at; override the env var to test installs against
another server.

Bases: items are declared once with base-relative file paths and built per
tree (`REGISTRY_BASES` in `registry-meta.ts`). Radix is the default and keeps
`registry.json` / `public/r`; every other base gets `registry.<base>.json` and
`public/r/<base>`, with `radix-ui` dependencies mapped to `@base-ui/react`
(`basePackages`).

Scripts are TypeScript, run with `tsx`, and type-checked by `pnpm typecheck`.
