import AnimatedNumberDemo from "@/registry/new-york/examples/animated-number-demo"
import AnnouncementBarDemo from "@/registry/new-york/examples/announcement-bar-demo"
import AvatarStackDemo from "@/registry/new-york/examples/avatar-stack-demo"
import CalloutDemo from "@/registry/new-york/examples/callout-demo"
import ColorPickerDemo from "@/registry/new-york/examples/color-picker-demo"
import ComboboxDemo from "@/registry/new-york/examples/combobox-demo"
import CopyButtonDemo from "@/registry/new-york/examples/copy-button-demo"
import CurrencyInputDemo from "@/registry/new-york/examples/currency-input-demo"
import EmptyStateDemo from "@/registry/new-york/examples/empty-state-demo"
import FileDropzoneDemo from "@/registry/new-york/examples/file-dropzone-demo"
import KbdDemo from "@/registry/new-york/examples/kbd-demo"
import LazySelectDemo from "@/registry/new-york/examples/lazy-select-demo"
import MarqueeDemo from "@/registry/new-york/examples/marquee-demo"
import MonthPickerDemo from "@/registry/new-york/examples/month-picker-demo"
import MultiSelectDemo from "@/registry/new-york/examples/multi-select-demo"
import NumberRangeDemo from "@/registry/new-york/examples/number-range-demo"
import PasswordInputDemo from "@/registry/new-york/examples/password-input-demo"
import PhoneInputDemo from "@/registry/new-york/examples/phone-input-demo"
import RatingDemo from "@/registry/new-york/examples/rating-demo"
import ScrollProgressDemo from "@/registry/new-york/examples/scroll-progress-demo"
import SpinnerDemo from "@/registry/new-york/examples/spinner-demo"
import StatCardDemo from "@/registry/new-york/examples/stat-card-demo"
import StepperDemo from "@/registry/new-york/examples/stepper-demo"
import TagInputDemo from "@/registry/new-york/examples/tag-input-demo"
import TimelineDemo from "@/registry/new-york/examples/timeline-demo"
import TimePickerDemo from "@/registry/new-york/examples/time-picker-demo"
import TreeViewDemo from "@/registry/new-york/examples/tree-view-demo"
import YearPickerDemo from "@/registry/new-york/examples/year-picker-demo"

import type { RegistryEntryMeta } from "@/registry/new-york/registry-types"

export const UI_REGISTRY: RegistryEntryMeta[] = [
  {
    name: "multi-select",
    title: "Multi Select",
    description:
      "Chip-based multi-select with command-palette dropdown, search, select-all and async loader.",
    category: "inputs",
    status: "stable",
    Demo: MultiSelectDemo,
    sourceFiles: ["registry/new-york/ui/multi-select.tsx"],
    registryDependencies: ["button", "popover", "command", "badge"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "number-range",
    title: "Number Range",
    description:
      "Two-thumb slider paired with synced number inputs, locale-aware formatting.",
    category: "inputs",
    status: "stable",
    Demo: NumberRangeDemo,
    sourceFiles: ["registry/new-york/ui/number-range.tsx"],
    registryDependencies: ["slider", "input", "label"],
    dependencies: ["@radix-ui/react-slider"],
  },
  {
    name: "year-picker",
    title: "Year Picker",
    description:
      "Decade-grid year picker with keyboard nav, min/max bounds, single or range mode.",
    category: "pickers",
    status: "stable",
    Demo: YearPickerDemo,
    sourceFiles: ["registry/new-york/ui/year-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "tag-input",
    title: "Tag Input",
    description:
      "Chip input with paste-to-split, dedupe, validation hook, max tags. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: TagInputDemo,
    sourceFiles: ["registry/new-york/ui/tag-input.tsx"],
    registryDependencies: ["badge"],
    dependencies: ["lucide-react"],
  },
  {
    name: "combobox",
    title: "Combobox",
    description:
      "Searchable single-select with debounced async loader, group headings and clearable selection.",
    category: "inputs",
    status: "stable",
    Demo: ComboboxDemo,
    sourceFiles: ["registry/new-york/ui/combobox.tsx"],
    registryDependencies: ["button", "popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "lazy-select",
    title: "Lazy Select",
    description:
      "Autocomplete single-select that defers loading until open and pages through results on scroll. Debounced server-side search with a pluggable lazy paginator hook.",
    category: "inputs",
    status: "stable",
    Demo: LazySelectDemo,
    sourceFiles: ["registry/new-york/ui/lazy-select.tsx"],
    registryDependencies: ["popover", "command"],
    dependencies: ["cmdk", "lucide-react"],
  },
  {
    name: "password-input",
    title: "Password Input",
    description:
      "Show/hide toggle with an optional pluggable strength meter. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: PasswordInputDemo,
    sourceFiles: ["registry/new-york/ui/password-input.tsx"],
    registryDependencies: ["input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "currency-input",
    title: "Currency Input",
    description:
      "Locale-aware grouping with currency-symbol prefix and configurable decimal precision.",
    category: "inputs",
    status: "stable",
    Demo: CurrencyInputDemo,
    sourceFiles: ["registry/new-york/ui/currency-input.tsx"],
    registryDependencies: ["input"],
    dependencies: [],
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description:
      "Country dial-code dropdown with E.164 output. Compound and single-prop APIs.",
    category: "inputs",
    status: "stable",
    Demo: PhoneInputDemo,
    sourceFiles: ["registry/new-york/ui/phone-input.tsx"],
    registryDependencies: ["input", "popover", "command"],
    dependencies: ["lucide-react"],
  },
  {
    name: "file-dropzone",
    title: "File Dropzone",
    description:
      "Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs.",
    category: "files",
    status: "stable",
    Demo: FileDropzoneDemo,
    sourceFiles: ["registry/new-york/ui/file-dropzone.tsx"],
    registryDependencies: ["button"],
    dependencies: ["lucide-react"],
  },
  {
    name: "stat-card",
    title: "Stat Card",
    description:
      "Compact metric card with label, value, and an up/down/flat trend chip.",
    category: "data",
    status: "stable",
    Demo: StatCardDemo,
    sourceFiles: ["registry/new-york/ui/stat-card.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "rating",
    title: "Rating",
    description:
      "Star rating with hover preview, half-star precision, read-only mode and sm / md / lg sizes.",
    category: "inputs",
    status: "stable",
    Demo: RatingDemo,
    sourceFiles: ["registry/new-york/ui/rating.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "timeline",
    title: "Timeline",
    description:
      "Vertical event timeline with default or icon dots, tone variants and labelled time / title / description parts.",
    category: "data",
    status: "stable",
    Demo: TimelineDemo,
    sourceFiles: ["registry/new-york/ui/timeline.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "kbd",
    title: "Kbd",
    description:
      "3D tactile keycap with hover lift and pressed states. Compound API with KbdGroup for chords and KbdDisplay for inline keys.",
    category: "display",
    status: "stable",
    Demo: KbdDemo,
    sourceFiles: ["registry/new-york/ui/kbd.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "callout",
    title: "Callout",
    description:
      "MDX-style admonition with info / success / warning / error / neutral variants and optional icon override.",
    category: "display",
    status: "stable",
    Demo: CalloutDemo,
    sourceFiles: ["registry/new-york/ui/callout.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react", "class-variance-authority"],
  },
  {
    name: "scroll-progress",
    title: "Scroll Progress",
    description:
      "Fixed reading progress bar. Tracks document scroll by default or a scoped container ref.",
    category: "display",
    status: "stable",
    Demo: ScrollProgressDemo,
    sourceFiles: ["registry/new-york/ui/scroll-progress.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "month-picker",
    title: "Month Picker",
    description:
      "4×3 month grid with year stepper, keyboard nav, min/max bounds, single or range mode.",
    category: "pickers",
    status: "stable",
    Demo: MonthPickerDemo,
    sourceFiles: ["registry/new-york/ui/month-picker.tsx"],
    registryDependencies: ["button", "popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "time-picker",
    title: "Time Picker",
    description:
      "Hour, minute and optional second scroll columns with 12/24h modes, step intervals and keyboard nav.",
    category: "pickers",
    status: "stable",
    Demo: TimePickerDemo,
    sourceFiles: ["registry/new-york/ui/time-picker.tsx"],
    registryDependencies: ["popover"],
    dependencies: ["lucide-react"],
  },
  {
    name: "color-picker",
    title: "Color Picker",
    description:
      "SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches.",
    category: "pickers",
    status: "stable",
    Demo: ColorPickerDemo,
    sourceFiles: ["registry/new-york/ui/color-picker.tsx"],
    registryDependencies: ["popover", "input"],
    dependencies: ["lucide-react"],
  },
  {
    name: "avatar-stack",
    title: "Avatar Stack",
    description:
      "Overlapping avatar group with size (sm/md/lg) and spacing (tight/normal/loose) variants, image or fallback support, numeric overflow chip, and asChild on items/overflow so each avatar can render as a link or button.",
    category: "data",
    status: "stable",
    Demo: AvatarStackDemo,
    sourceFiles: ["registry/new-york/ui/avatar-stack.tsx"],
    registryDependencies: [],
    dependencies: ["@radix-ui/react-slot"],
  },
  {
    name: "announcement-bar",
    title: "Announcement Bar",
    description:
      "Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence.",
    category: "display",
    status: "stable",
    Demo: AnnouncementBarDemo,
    sourceFiles: ["registry/new-york/ui/announcement-bar.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "empty-state",
    title: "Empty State",
    description:
      "Dashed-bordered empty-state surface with media slot, title, description and an action row.",
    category: "display",
    status: "stable",
    Demo: EmptyStateDemo,
    sourceFiles: ["registry/new-york/ui/empty-state.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "spinner",
    title: "Spinner",
    description:
      "Loading indicator with circle, dots and bars variants, sm / md / lg sizes. Inherits the current text color and ships an accessible status label.",
    category: "display",
    status: "stable",
    Demo: SpinnerDemo,
    sourceFiles: ["registry/new-york/ui/spinner.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "copy-button",
    title: "Copy Button",
    description:
      "Click-to-copy button with copied feedback, icon-only or labelled, ghost / outline variants and a non-secure-context clipboard fallback.",
    category: "display",
    status: "stable",
    Demo: CopyButtonDemo,
    sourceFiles: ["registry/new-york/ui/copy-button.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "marquee",
    title: "Marquee",
    description:
      "Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes ship inline — zero config.",
    category: "display",
    status: "stable",
    Demo: MarqueeDemo,
    sourceFiles: ["registry/new-york/ui/marquee.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "tree-view",
    title: "Tree View",
    description:
      "Collapsible nested tree for file explorers and hierarchical data, with auto folder/file icons, depth indentation, selection and keyboard focus.",
    category: "data",
    status: "stable",
    Demo: TreeViewDemo,
    sourceFiles: ["registry/new-york/ui/tree-view.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
  {
    name: "animated-number",
    title: "Animated Number",
    description:
      "Count-up number that tweens to its target with easing, Intl formatting (currency, compact, percent), prefix/suffix and reduced-motion support.",
    category: "data",
    status: "stable",
    Demo: AnimatedNumberDemo,
    sourceFiles: ["registry/new-york/ui/animated-number.tsx"],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: "stepper",
    title: "Stepper",
    description:
      "Multi-step progress indicator with horizontal and vertical orientation, completed / active / inactive states, clickable steps and a compound API.",
    category: "navigation",
    status: "stable",
    Demo: StepperDemo,
    sourceFiles: ["registry/new-york/ui/stepper.tsx"],
    registryDependencies: [],
    dependencies: ["lucide-react"],
  },
]
