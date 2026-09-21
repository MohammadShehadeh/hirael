import { cn } from '@/lib/utils';

const railClassName =
  'pointer-events-none absolute inset-y-0 hidden w-px bg-border mask-[linear-gradient(to_bottom,transparent,black_6%)] xl:block';

export const SideRails = () => {
  return (
    <>
      <div aria-hidden className={cn(railClassName, '-inset-s-px')} />
      <div aria-hidden className={cn(railClassName, '-inset-e-px')} />
    </>
  );
};
