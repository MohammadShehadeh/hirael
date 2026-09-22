import { PillButton, Wordmark } from './primitives';

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Studio', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Journal', href: '#' },
  { label: 'Reach Us', href: '#' },
];

export const Navbar = () => {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
      <Wordmark className="text-3xl" />

      <div className="hidden items-center gap-10 text-sm text-white md:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="text-white transition-colors hover:text-white/80">
            {link.label}
          </a>
        ))}
      </div>

      <PillButton className="px-6 py-2.5">Begin Journey</PillButton>
    </nav>
  );
};
