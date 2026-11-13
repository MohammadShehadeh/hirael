import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { extractHeadings, findDoc, type DocHeading, type DocPage } from '@/lib/docs-nav';

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');

export interface Doc extends DocPage {
  body: string;
  headings: DocHeading[];
}

/** Read at build time; the static export freezes it. */
export const getDoc = (slug: string): Doc | null => {
  const page = findDoc(slug);
  if (!page) return null;
  const file = path.join(DOCS_DIR, `${slug || 'index'}.mdx`);
  if (!fs.existsSync(file)) return null;
  const body = fs.readFileSync(file, 'utf8').trim();

  return { ...page, body, headings: extractHeadings(body) };
};
