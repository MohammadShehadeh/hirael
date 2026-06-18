"use client";

import {
  AssetManager,
  AssetLibrary,
  AssetToolbar,
  AssetGrid,
  AssetDetail,
  type Asset,
} from "@/registry/hirael/ui/asset-manager";

const ASSETS: Asset[] = [
  {
    id: "hero-banner",
    name: "hero-banner.jpg",
    type: "image",
    size: 2_412_544,
    modified: "Jun 14, 2026",
    dimensions: "2400 × 1350",
    tags: ["marketing", "hero"],
  },
  {
    id: "brand-guide",
    name: "brand-guidelines.pdf",
    type: "document",
    size: 884_736,
    modified: "Jun 9, 2026",
    tags: ["brand"],
  },
  {
    id: "product-tour",
    name: "product-tour.mp4",
    type: "video",
    size: 48_234_496,
    modified: "Jun 2, 2026",
    dimensions: "1920 × 1080",
    tags: ["demo"],
  },
  {
    id: "avatar-grid",
    name: "avatar-grid.png",
    type: "image",
    size: 312_320,
    modified: "May 28, 2026",
    dimensions: "800 × 800",
  },
  {
    id: "launch-deck",
    name: "launch-deck.pdf",
    type: "document",
    size: 1_572_864,
    modified: "May 21, 2026",
    tags: ["launch", "internal"],
  },
  {
    id: "intro-jingle",
    name: "intro-jingle.mp3",
    type: "audio",
    size: 4_194_304,
    modified: "May 12, 2026",
    tags: ["sound"],
  },
];

export default function AssetManagerDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <AssetManager assets={ASSETS} defaultSelectedId="hero-banner">
        <AssetLibrary>
          <AssetToolbar />
          <AssetGrid />
        </AssetLibrary>
        <AssetDetail />
      </AssetManager>

      <AssetManager assets={ASSETS} defaultView="list">
        <AssetLibrary>
          <AssetToolbar searchPlaceholder="Filter by name or tag" />
          <AssetGrid />
        </AssetLibrary>
        <AssetDetail />
      </AssetManager>
    </div>
  );
}
