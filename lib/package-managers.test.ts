import { describe, expect, it } from 'vitest';

import { getShadcnAddCommand, getShadcnInitCommand } from '@/lib/package-managers';

const URL = 'https://hirael.com/r/tag-input.json';

describe('getShadcnAddCommand', () => {
  it.each([
    ['npm', `npx shadcn@latest add ${URL}`],
    ['pnpm', `pnpm dlx shadcn@latest add ${URL}`],
    ['yarn', `yarn dlx shadcn@latest add ${URL}`],
    ['bun', `bunx --bun shadcn@latest add ${URL}`],
  ] as const)('should use the %s runner', (packageManager, command) => {
    expect(getShadcnAddCommand(packageManager, URL)).toBe(command);
  });
});

describe('getShadcnInitCommand', () => {
  it('should drop the trailing space when there are no flags', () => {
    expect(getShadcnInitCommand('pnpm', '')).toBe('pnpm dlx shadcn@latest init');
  });
});
