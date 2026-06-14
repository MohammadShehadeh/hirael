import { LogoIcon } from "./logo-icon"

const NAV_LINKS = ["Network", "Ecosystem", "Rewards", "Help", "News"]

export function Navbar() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-20 px-6 py-5">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-7 w-7 text-black" />
          <span className="text-2xl font-medium tracking-tight text-black">
            Halo
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-base font-medium text-gray-700 transition-colors duration-200 hover:text-black"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-full bg-black px-7 py-2.5 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800"
        >
          Open Wallet
        </button>
      </div>
    </nav>
  )
}
