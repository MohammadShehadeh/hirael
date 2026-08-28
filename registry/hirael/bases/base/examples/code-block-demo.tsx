'use client';

import { useT } from '@/lib/demo-locale';
import { CodeBlock } from '@/registry/hirael/bases/base/components/code-block';

const utilsSnippet = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

const diffSnippet = `const config = {
  output: "standalone",
  reactStrictMode: false,
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
}`;

const longSnippet = `type Result<T> = { ok: true; value: T } | { ok: false; error: Error }

async function fetchJson<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { ok: false, error: new Error(\`HTTP \${response.status}\`) }
    }
    const value = (await response.json()) as T
    return { ok: true, value }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    }
  }
}

export async function loadUsers() {
  const result = await fetchJson<{ id: string; name: string }[]>("/api/users")
  if (!result.ok) throw result.error
  return result.value
}`;

const CodeBlockDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Filename, language and highlighted lines',
            ar: 'اسم الملف واللغة والأسطر المظلَّلة',
          })}
        </p>
        <CodeBlock code={utilsSnippet} filename="lib/utils.ts" language="ts" highlightLines={[4, 5]} />
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Diff: config change', ar: 'فرق: تغيير الإعدادات' })}
        </p>
        <CodeBlock
          code={diffSnippet}
          filename="next.config.ts"
          language="ts"
          addedLines={[4, 5, 6, 7]}
          removedLines={[3]}
        />
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Max height with expand', ar: 'ارتفاع أقصى مع التوسيع' })}
        </p>
        <CodeBlock code={longSnippet} filename="lib/fetch-json.ts" language="ts" maxHeight={180} />
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Bare, no header, no numbers',
            ar: 'مجرّد، بلا ترويسة، بلا أرقام',
          })}
        </p>
        <CodeBlock showLineNumbers={false} copyable={false}>
          npx shadcn@latest add code-block
        </CodeBlock>
      </div>
    </div>
  );
};

export default CodeBlockDemo;
