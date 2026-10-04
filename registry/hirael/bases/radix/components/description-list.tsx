import * as React from 'react';

import { cn } from '@/lib/utils';

export type DescriptionListOrientation = 'horizontal' | 'vertical';

export interface DescriptionListProps extends React.ComponentProps<'dl'> {
  /**
   * `horizontal` puts each term beside its value once the list is wide enough,
   * and stacks them on narrow containers. `vertical` always stacks.
   */
  orientation?: DescriptionListOrientation;
  /** Items per row. Extra columns appear only once the container is wide enough. */
  columns?: 1 | 2 | 3;
  /** Draw a hairline between items. */
  divided?: boolean;
}

const COLUMN_CLASS = {
  1: '',
  2: '@xl/description-list:grid-cols-2',
  3: '@xl/description-list:grid-cols-2 @4xl/description-list:grid-cols-3',
} as const;

const DescriptionList = ({
  orientation = 'horizontal',
  columns = 1,
  divided = false,
  className,
  ...props
}: DescriptionListProps) => {
  return (
    <div data-slot="description-list-container" className="@container/description-list w-full">
      <dl
        data-slot="description-list"
        data-orientation={orientation}
        data-divided={divided || undefined}
        className={cn(
          'group/description-list grid gap-x-8 text-sm',
          divided ? 'gap-y-0' : 'gap-y-4',
          COLUMN_CLASS[columns],
          className,
        )}
        {...props}
      />
    </div>
  );
};

const DescriptionListItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="description-list-item"
      className={cn(
        'grid min-w-0 content-start gap-1',
        'group-data-[orientation=horizontal]/description-list:@md/description-list:grid-cols-[minmax(0,var(--description-list-term-width,11rem))_minmax(0,1fr)] group-data-[orientation=horizontal]/description-list:@md/description-list:gap-4',
        'group-data-divided/description-list:border-b group-data-divided/description-list:border-border group-data-divided/description-list:py-3 group-data-divided/description-list:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
};

const DescriptionListTerm = ({ className, ...props }: React.ComponentProps<'dt'>) => {
  return (
    <dt
      data-slot="description-list-term"
      className={cn('flex min-w-0 items-center gap-2 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0', className)}
      {...props}
    />
  );
};

const DescriptionListDetails = ({ className, ...props }: React.ComponentProps<'dd'>) => {
  return (
    <dd
      data-slot="description-list-details"
      className={cn('flex min-w-0 flex-wrap items-center gap-2 font-medium text-foreground', className)}
      {...props}
    />
  );
};

export { DescriptionList, DescriptionListItem, DescriptionListTerm, DescriptionListDetails };
