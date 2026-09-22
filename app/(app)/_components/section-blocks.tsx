import { BlockShowcase } from '@/components/block-showcase';
import { SectionHeading } from '@/components/page-header';
import { BLOCK_KIND_ORDER, BLOCKS_BY_KIND } from '@/registry/hirael/registry-meta';

const blocksTotal = BLOCK_KIND_ORDER.reduce((sum, kind) => sum + BLOCKS_BY_KIND[kind].length, 0);

export const SectionBlocks = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Section blocks"
          title="Blocks for whole sections of a page."
          blurb={`${blocksTotal} sections in ${BLOCK_KIND_ORDER.length} categories: heroes, pricing, testimonials, FAQs, auth and dashboards. Each is built from the same components, so a block you install matches the ones you already have.`}
        />

        <BlockShowcase />
      </div>
    </section>
  );
};
