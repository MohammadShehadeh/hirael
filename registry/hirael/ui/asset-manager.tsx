"use client";

import * as React from "react";
import {
  Download,
  FileText,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Music,
  Search,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

export type AssetType = "image" | "video" | "audio" | "document";

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  url?: string;
  modified?: string;
  dimensions?: string;
  tags?: string[];
};

export type AssetView = "grid" | "list";

const TYPE_ICON: Record<AssetType, React.ComponentType<{ className?: string }>> =
  {
    image: ImageIcon,
    video: Film,
    audio: Music,
    document: FileText,
  };

const TYPE_LABEL: Record<AssetType, string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  document: "Document",
};

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  const fixed = i === 0 ? n.toFixed(0) : n.toFixed(1);
  return `${fixed} ${units[i]}`;
}

type Ctx = {
  assets: Asset[];
  filtered: Asset[];
  view: AssetView;
  setView: (view: AssetView) => void;
  query: string;
  setQuery: (query: string) => void;
  selectedIds: string[];
  selectedAsset: Asset | null;
  isSelected: (id: string) => boolean;
  select: (id: string, additive?: boolean) => void;
  toggle: (id: string) => void;
};

const AssetManagerContext = React.createContext<Ctx | null>(null);

function useAssetManager(): Ctx {
  const ctx = React.useContext(AssetManagerContext);
  if (!ctx) {
    throw new Error(
      "AssetManager compound parts must be used inside <AssetManager>",
    );
  }
  return ctx;
}

export type AssetManagerProps = React.ComponentProps<"div"> & {
  /** Assets to display in the library. */
  assets: Asset[];
  /** Initial layout for an uncontrolled manager. */
  defaultView?: AssetView;
  /** Id of the asset selected on first render. */
  defaultSelectedId?: string;
};

function AssetManager({
  assets,
  defaultView = "grid",
  defaultSelectedId,
  className,
  children,
  ...props
}: AssetManagerProps) {
  const [view, setView] = React.useState<AssetView>(defaultView);
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    defaultSelectedId ? [defaultSelectedId] : [],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(q) ||
        asset.type.toLowerCase().includes(q) ||
        asset.tags?.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [assets, query]);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  const select = React.useCallback((id: string, additive = false) => {
    setSelectedIds((current) => {
      if (additive) {
        return current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id];
      }
      return [id];
    });
  }, []);

  const toggle = React.useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }, []);

  const selectedAsset = React.useMemo(() => {
    const lastId = selectedIds[selectedIds.length - 1];
    return assets.find((asset) => asset.id === lastId) ?? null;
  }, [assets, selectedIds]);

  const ctx = React.useMemo<Ctx>(
    () => ({
      assets,
      filtered,
      view,
      setView,
      query,
      setQuery,
      selectedIds,
      selectedAsset,
      isSelected,
      select,
      toggle,
    }),
    [
      assets,
      filtered,
      view,
      query,
      selectedIds,
      selectedAsset,
      isSelected,
      select,
      toggle,
    ],
  );

  return (
    <AssetManagerContext.Provider value={ctx}>
      <div
        data-slot="asset-manager"
        className={cn(
          "flex w-full flex-col gap-3 sm:flex-row sm:items-start",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AssetManagerContext.Provider>
  );
}

type AssetLibraryProps = React.ComponentProps<"div">;

function AssetLibrary({ className, ...props }: AssetLibraryProps) {
  return (
    <div
      data-slot="asset-library"
      className={cn("flex min-w-0 flex-1 flex-col gap-3", className)}
      {...props}
    />
  );
}

type AssetToolbarProps = React.ComponentProps<"div"> & {
  /** Placeholder for the search field. */
  searchPlaceholder?: string;
};

function AssetToolbar({
  searchPlaceholder = "Search assets",
  className,
  children,
  ...props
}: AssetToolbarProps) {
  const { query, setQuery, view, setView, filtered } = useAssetManager();
  const searchId = React.useId();

  return (
    <div
      data-slot="asset-toolbar"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={searchId}
          type="search"
          role="searchbox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          data-slot="asset-toolbar-search"
          className="h-8 w-full rounded-md border border-border bg-background ps-8 pe-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
        />
      </div>
      {children}
      <div
        role="group"
        aria-label="View"
        data-slot="asset-toolbar-view"
        className="flex shrink-0 items-center gap-0.5 rounded-md border border-border p-0.5"
      >
        <Button
          type="button"
          variant={view === "grid" ? "secondary" : "ghost"}
          size="icon-xs"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => setView("grid")}
        >
          <LayoutGrid />
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "secondary" : "ghost"}
          size="icon-xs"
          aria-label="List view"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          <List />
        </Button>
      </div>
      <span
        data-slot="asset-toolbar-count"
        className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground"
      >
        {filtered.length}
      </span>
    </div>
  );
}

type AssetThumbnailProps = React.ComponentProps<"div"> & {
  asset: Asset;
};

function AssetThumbnail({
  asset,
  className,
  children,
  ...props
}: AssetThumbnailProps) {
  const Icon = TYPE_ICON[asset.type];
  return (
    <div
      data-slot="asset-thumbnail"
      data-type={asset.type}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    >
      {asset.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.url}
          alt={asset.name}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <Icon className="size-1/3 max-h-10 max-w-10" aria-hidden />
      )}
      {children}
    </div>
  );
}

type AssetGridProps = React.ComponentProps<"div"> & {
  /** Rendered when no assets match the current search. */
  emptyState?: React.ReactNode;
};

function AssetGrid({
  emptyState,
  className,
  children,
  ...props
}: AssetGridProps) {
  const { filtered, view } = useAssetManager();

  if (filtered.length === 0) {
    return (
      <div
        data-slot="asset-grid-empty"
        className={cn(
          "flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        {emptyState ?? "No assets found"}
      </div>
    );
  }

  return (
    <div
      role={view === "list" ? "listbox" : "grid"}
      aria-label="Assets"
      data-slot="asset-grid"
      data-view={view}
      className={cn(
        view === "grid"
          ? "grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2"
          : "flex flex-col gap-1",
        className,
      )}
      {...props}
    >
      {children ??
        filtered.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
    </div>
  );
}

type AssetCardProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  asset: Asset;
};

function AssetCard({ asset, className, ...props }: AssetCardProps) {
  const { view, isSelected, select, toggle } = useAssetManager();
  const selected = isSelected(asset.id);
  const Icon = TYPE_ICON[asset.type];

  const onClick = (event: React.MouseEvent) => {
    select(asset.id, event.metaKey || event.ctrlKey || event.shiftKey);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(asset.id, event.metaKey || event.ctrlKey || event.shiftKey);
    }
  };

  if (view === "list") {
    return (
      <div
        role="option"
        data-slot="asset-card"
        data-type={asset.type}
        data-selected={selected}
        aria-selected={selected}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={cn(
          "group flex cursor-default items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-start transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          selected && "border-primary/40 bg-primary/10",
          className,
        )}
        {...props}
      >
        <input
          type="checkbox"
          checked={selected}
          aria-label={`Select ${asset.name}`}
          onClick={(event) => event.stopPropagation()}
          onChange={() => toggle(asset.id)}
          className="size-3.5 shrink-0 cursor-pointer accent-primary"
        />
        <AssetThumbnail
          asset={asset}
          className="size-9 shrink-0 rounded-md [&_svg]:size-4"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {asset.name}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatBytes(asset.size)}
          </span>
        </div>
        <Badge variant="outline" className="shrink-0 gap-1">
          <Icon aria-hidden />
          {TYPE_LABEL[asset.type]}
        </Badge>
      </div>
    );
  }

  return (
    <div
      role="gridcell"
      data-slot="asset-card"
      data-type={asset.type}
      data-selected={selected}
      aria-selected={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative flex cursor-default flex-col gap-2 rounded-lg border border-border bg-card p-2 text-start transition-colors outline-none hover:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary ring-2 ring-primary",
        className,
      )}
      {...props}
    >
      <input
        type="checkbox"
        checked={selected}
        aria-label={`Select ${asset.name}`}
        onClick={(event) => event.stopPropagation()}
        onChange={() => toggle(asset.id)}
        className={cn(
          "absolute end-2 top-2 z-10 size-4 cursor-pointer accent-primary opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[selected=true]:opacity-100",
          selected && "opacity-100",
        )}
      />
      <AssetThumbnail asset={asset} className="aspect-square rounded-md" />
      <div className="flex flex-col gap-1">
        <span className="truncate text-xs font-medium text-foreground">
          {asset.name}
        </span>
        <div className="flex items-center justify-between gap-1">
          <Badge variant="outline" className="gap-1">
            <Icon aria-hidden />
            {TYPE_LABEL[asset.type]}
          </Badge>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {formatBytes(asset.size)}
          </span>
        </div>
      </div>
    </div>
  );
}

type AssetDetailProps = React.ComponentProps<"aside"> & {
  /** Rendered when nothing is selected. */
  emptyState?: React.ReactNode;
};

function AssetDetailRow({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="asset-detail-row"
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-baseline gap-2"
    >
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 text-end text-xs text-foreground">
        {children}
      </span>
    </div>
  );
}

function AssetDetail({
  emptyState,
  className,
  children,
  ...props
}: AssetDetailProps) {
  const { selectedAsset } = useAssetManager();

  return (
    <aside
      data-slot="asset-detail"
      className={cn(
        "flex w-full shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground sm:max-w-64",
        className,
      )}
      {...props}
    >
      {selectedAsset ? (
        children ?? <AssetDetailContent asset={selectedAsset} />
      ) : (
        <div
          data-slot="asset-detail-empty"
          className="flex flex-1 items-center justify-center px-4 py-10 text-center text-sm text-muted-foreground"
        >
          {emptyState ?? "Select an asset"}
        </div>
      )}
    </aside>
  );
}

type AssetDetailContentProps = {
  asset: Asset;
};

function AssetDetailContent({ asset }: AssetDetailContentProps) {
  const Icon = TYPE_ICON[asset.type];

  return (
    <div className="flex flex-col" data-slot="asset-detail-content">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          Details
        </p>
        <Badge variant="outline" className="gap-1">
          <Icon aria-hidden />
          {TYPE_LABEL[asset.type]}
        </Badge>
      </div>

      <AssetThumbnail
        asset={asset}
        className="aspect-video border-b border-border [&_svg]:size-10"
      />

      <div className="flex flex-col gap-2 px-3 py-3">
        <p className="truncate text-sm font-medium text-foreground">
          {asset.name}
        </p>
        <AssetDetailRow label="Type">{TYPE_LABEL[asset.type]}</AssetDetailRow>
        <AssetDetailRow label="Size">{formatBytes(asset.size)}</AssetDetailRow>
        {asset.dimensions ? (
          <AssetDetailRow label="Dimensions">{asset.dimensions}</AssetDetailRow>
        ) : null}
        {asset.modified ? (
          <AssetDetailRow label="Modified">{asset.modified}</AssetDetailRow>
        ) : null}
        {asset.tags && asset.tags.length > 0 ? (
          <div
            data-slot="asset-detail-tags"
            className="flex flex-wrap gap-1 pt-1"
          >
            {asset.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-border px-3 py-2.5">
        <Button type="button" variant="outline" size="sm" className="flex-1">
          <Download />
          Download
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Delete asset"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export {
  AssetManager,
  AssetLibrary,
  AssetToolbar,
  AssetGrid,
  AssetCard,
  AssetThumbnail,
  AssetDetail,
  useAssetManager,
};
