# scripts

Build pipeline for the registry. `registry/hirael/registry-meta.ts` is the
single source of truth; everything below derives from it and is git-ignored.

| Command               | Script                                  | Reads                                   | Writes                                |
| --------------------- | --------------------------------------- | --------------------------------------- | ------------------------------------- |
| `pnpm registry:gen`   | `build-registry.mts`                    | `registry-meta.ts`                      | `registry.json`                       |
|                       | `build-llms.mts`                        | `registry-meta.ts`                      | `public/llms.txt`                     |
| `pnpm registry:props` | `extract-props.mts`                     | component source                        | `registry/hirael/registry-props.json` |
| `pnpm check:registry` | `check-registry.mts`                    | `registry-meta.ts`, item source         | nothing (exits 1 on problems)         |
| `pnpm registry:build` | `shadcn build`, then `stamp-source.mts` | `registry.json`, item source            | `public/r/*.json`                     |
| `pnpm check:install`  | `check-install.mts`                     | `public/r/*.json` (rebuilds them first) | nothing (exits 1 on problems)         |

`pnpm build` runs them in that order before `next build`; `pnpm install`
runs `registry:gen` and `registry:props` (via `prepare`) so a fresh clone can
`dev` and `typecheck` right away.

`shared.mts` holds what more than one script needs: repo paths, the brand
fields read from `package.json`, the entry list with the showcased/
distribution-only split, the source header, and the pass/fail reporter.
`REGISTRY_BASE_URL` (default: `package.json` `homepage`) is the host every
generated URL points at; override the env var to test installs against
another server.

Scripts are TypeScript, run with `tsx`, and type-checked by `pnpm typecheck`.
