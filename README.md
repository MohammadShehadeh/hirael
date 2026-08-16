# Hirael

The components shadcn/ui doesn't ship — multi-select, number range, pickers,
tag input, phone input, file dropzone, and a few dozen more, plus section
blocks and full-page templates. Hirael is a shadcn-compatible registry: the
CLI copies source straight into your repo, with no runtime package to depend
on.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-000)](https://ui.shadcn.com/docs/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

```bash
npx shadcn@latest add https://hirael.com/r/multi-select.json
```

Browse the full catalog at **[hirael.com](https://hirael.com)**.

## How it works

Hirael is a peer of shadcn/ui, not a replacement — you need shadcn installed
first. Its components import shadcn primitives from `@/components/ui/*`, and it
ships through the shadcn registry schema, so `shadcn add` fetches each
dependency, installs the npm packages, and copies the source into your project
(rewriting import aliases to match your `components.json`). Nothing from Hirael
is present at runtime.

## What's inside

- **~64 components** — inputs (multi-select, tag input, phone, currency),
  pickers (year, month, time, color), data display, editors, and more.
- **80+ section blocks** — hero, feature, pricing, testimonial, CTA, FAQ,
  auth, dashboard, and app-shell blocks.
- **9 full-page templates** — finished multi-section layouts.

Every item ships a flat compound API (the way shadcn ships primitives) with a
`data-slot` on each rendered slot, works under `dir="rtl"` out of the box, and
is driven entirely by design tokens so light and dark both work.

## Usage

```tsx
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/ui/multi-select";

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>;
```

## Development

This repo is the showcase site — a static Next.js 16 export that previews every
item and serves the generated `/r/*.json` registry files. Requires Node 22
(see `.nvmrc`) and pnpm 10.

```bash
git clone https://github.com/MohammadShehadeh/hirael.com.git
cd hirael.com
pnpm install
pnpm dev            # showcase at http://localhost:3000
```

| Script                         | Does                                                  |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                                |
| `pnpm build`                   | Regenerate the registry, then static-export to `out/` |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit`                               |

Every item is declared in `registry/hirael/registry-meta.ts`, the single source
of truth; `registry.json` is generated from it — never hand-edit it.

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the workflow, commit
conventions, and the component checklist. Participation is governed by our
**[Code of Conduct](./CODE_OF_CONDUCT.md)**.

## Security

Report vulnerabilities privately — see **[SECURITY.md](./SECURITY.md)**.

## License

MIT © Mohammad Shehadeh. See **[LICENSE](./LICENSE)**.
