import { LogoIcon, PillButton } from "./primitives";

const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  { heading: "Product", links: ["Wallet", "Rewards", "Network", "Security"] },
  { heading: "Developers", links: ["Docs", "API", "Status", "GitHub"] },
  { heading: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { heading: "Legal", links: ["Terms", "Privacy", "Disclosures", "Cookies"] },
];

/**
 * Dark anchor footer. The off-white page resolves onto a #2B2644 card that
 * echoes the hero and info cards: brand lockup and an inverted Open Wallet
 * pill up top, four link columns, then a legal bar.
 */
export const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F5F5] px-6 pb-6">
      <div className="mx-auto max-w-[88rem]">
        <div className="rounded-2xl bg-[#2B2644] p-10 md:p-14">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 md:flex-row md:items-end">
            <div className="max-w-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <LogoIcon className="h-7 w-7 text-white" />
                <span className="text-2xl font-medium tracking-tight text-white">
                  Halo
                </span>
              </div>
              <p className="text-base leading-relaxed text-white/60">
                A reward-earning digital dollar, pegged to USD and built to grow
                while you hold it.
              </p>
            </div>

            <PillButton
              label="Open Wallet"
              inverted
              className="self-start md:self-auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="mb-4 text-sm font-medium text-white">
                  {column.heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/55 transition-colors duration-200 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-white/50">
              © {year} Halo. All rights reserved.
            </p>
            <p className="text-sm text-white/40">
              USD Halo is a digital dollar token, not a bank deposit.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
