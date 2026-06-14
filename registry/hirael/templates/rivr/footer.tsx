import { RivrMark } from "./primitives"

const COLUMNS = [
  { heading: "Protocol", links: ["Vaults", "Staking", "Lending", "NFT collateral"] },
  { heading: "Developers", links: ["Docs", "SDK", "API", "Status"] },
  { heading: "Community", links: ["Discord", "Forum", "Governance", "Blog"] },
]

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="border-t border-border bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-[1536px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <a
              href="#home"
              className="flex w-fit items-center gap-2 text-foreground"
              aria-label="RIVR home"
            >
              <RivrMark className="size-6" />
              <span className="text-lg font-semibold">RIVR</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Fluid staking and streaming yield for assets that never sit still.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16"
          >
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-sm font-semibold text-foreground">
                  {column.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            © 2026 RIVR. Fluid asset streams.
          </p>
        </div>
      </div>
    </footer>
  )
}
