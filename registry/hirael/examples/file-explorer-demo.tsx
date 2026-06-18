"use client";

import {
  FileExplorer,
  FileExplorerBreadcrumb,
  FileExplorerList,
  FileExplorerSidebar,
  FileExplorerToolbar,
  FileExplorerTree,
  type FileNode,
} from "@/registry/hirael/ui/file-explorer";

const PROJECT: FileNode = {
  name: "my-app",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            {
              name: "button.tsx",
              type: "file",
              size: 2480,
              modified: "Jun 12",
            },
            { name: "card.tsx", type: "file", size: 1920, modified: "Jun 10" },
            {
              name: "nav.tsx",
              type: "file",
              size: 3640,
              modified: "Jun 14",
            },
          ],
        },
        {
          name: "lib",
          type: "folder",
          children: [
            { name: "utils.ts", type: "file", size: 860, modified: "May 30" },
            { name: "api.ts", type: "file", size: 4210, modified: "Jun 8" },
          ],
        },
        { name: "app.tsx", type: "file", size: 1240, modified: "Jun 15" },
        { name: "main.tsx", type: "file", size: 520, modified: "Apr 22" },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "favicon.ico", type: "file", size: 15400, modified: "Apr 1" },
        { name: "logo.svg", type: "file", size: 3120, modified: "May 18" },
      ],
    },
    { name: "package.json", type: "file", size: 1840, modified: "Jun 16" },
    { name: "README.md", type: "file", size: 2200, modified: "Jun 2" },
  ],
};

export default function FileExplorerDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <FileExplorer tree={PROJECT} defaultPath={["src"]} className="h-80">
        <FileExplorerSidebar>
          <FileExplorerTree />
        </FileExplorerSidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <FileExplorerToolbar />
          <FileExplorerList />
        </div>
      </FileExplorer>

      <FileExplorer
        tree={PROJECT}
        defaultPath={["public"]}
        defaultView="grid"
        className="h-80"
      >
        <FileExplorerSidebar>
          <FileExplorerTree />
        </FileExplorerSidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <FileExplorerToolbar>
            <FileExplorerBreadcrumb rootLabel="Files" />
          </FileExplorerToolbar>
          <FileExplorerList emptyState="Nothing here" />
        </div>
      </FileExplorer>
    </div>
  );
}
