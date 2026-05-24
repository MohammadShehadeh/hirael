import { ThemePlayground } from "./playground"

export const metadata = {
  title: "Theme playground",
  description:
    "Preview every Hirael component against your own theme. Paste CSS variables, pick a preset, and see the registry render live.",
}

export default function ThemePage() {
  return <ThemePlayground />
}
