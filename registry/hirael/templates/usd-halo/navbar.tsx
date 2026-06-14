import { LogoIcon } from "./primitives";

const NAV_LINKS = ["Network", "Ecosystem", "Rewards", "Help", "News"];

export function Navbar() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 px-6 py-5">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between">
        <a
          href="#"
          aria-label="Halo home"
          className="flex items-center gap-2.5"
        >
          <LogoIcon className="h-7 w-7 text-black" />
          <span className="text-2xl font-medium tracking-tight text-black">
            Halo
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-base font-medium text-gray-700 transition-colors duration-200 hover:text-black"
            >
              {link}
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
  );
}
