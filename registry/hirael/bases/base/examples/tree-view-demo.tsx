'use client';

import * as React from 'react';
import { Archive, FileText, Inbox, Send, Trash2 } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { TreeItem, TreeView } from '@/registry/hirael/bases/base/components/tree-view';

const TreeViewDemo = () => {
  const t = useT();
  const [selected, setSelected] = React.useState('page');

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'File explorer · selected', ar: 'مستعرض الملفات · المحدد' })}{' '}
          <span className="text-foreground">{selected}</span>
        </p>
        <div className="rounded-md border border-border bg-card/40 p-2">
          <TreeView value={selected} onValueChange={setSelected}>
            <TreeItem value="app" label="app" defaultExpanded>
              <TreeItem value="layout" label="layout.tsx" />
              <TreeItem value="page" label="page.tsx" />
              <TreeItem value="components" label="components" defaultExpanded>
                <TreeItem value="header" label="header.tsx" />
                <TreeItem value="footer" label="footer.tsx" />
              </TreeItem>
            </TreeItem>
            <TreeItem value="lib" label="lib">
              <TreeItem value="utils" label="utils.ts" />
            </TreeItem>
            <TreeItem value="readme" label="README.md" />
            <TreeItem value="package" label="package.json" />
          </TreeView>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Custom icons', ar: 'أيقونات مخصصة' })}
        </p>
        <div className="rounded-md border border-border bg-card/40 p-2">
          <TreeView defaultValue="inbox">
            <TreeItem value="mail" label={t({ en: 'Mail', ar: 'البريد' })} icon={null} defaultExpanded>
              <TreeItem
                value="inbox"
                label={t({ en: 'Inbox', ar: 'الوارد' })}
                icon={<Inbox className="text-muted-foreground" />}
              />
              <TreeItem
                value="sent"
                label={t({ en: 'Sent', ar: 'المرسل' })}
                icon={<Send className="text-muted-foreground rtl:-scale-x-100" />}
              />
              <TreeItem
                value="drafts"
                label={t({ en: 'Drafts', ar: 'المسودات' })}
                icon={<FileText className="text-muted-foreground" />}
              />
            </TreeItem>
            <TreeItem
              value="archive"
              label={t({ en: 'Archive', ar: 'الأرشيف' })}
              icon={<Archive className="text-muted-foreground" />}
            />
            <TreeItem
              value="trash"
              label={t({ en: 'Trash', ar: 'المهملات' })}
              icon={<Trash2 className="text-muted-foreground" />}
              disabled
            />
          </TreeView>
        </div>
      </div>
    </div>
  );
};

export default TreeViewDemo;
