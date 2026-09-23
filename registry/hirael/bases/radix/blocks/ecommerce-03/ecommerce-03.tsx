'use client';

import * as React from 'react';
import Image from 'next/image';
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, RotateCcw, ShoppingBag, Truck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Rating } from '@/registry/hirael/bases/radix/components/rating';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/radix/ui/accordion';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/registry/hirael/bases/radix/ui/breadcrumb';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/registry/hirael/bases/radix/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-95 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const PHOTO = '/media/blocks/ecommerce-03/atlas-headphones.jpg';

const VIEWS = [
  { label: 'Front', scale: 1, origin: '50% 50%' },
  { label: 'Headband', scale: 2, origin: '70% 22%' },
  { label: 'Ear cushion', scale: 2.2, origin: '38% 60%' },
  { label: 'Controls', scale: 2.6, origin: '72% 74%' },
] as const;

// Product finishes are catalogue data, so they stay the same in both themes.
const COLOURS = [
  { value: 'graphite', label: 'Graphite', swatch: 'oklch(0.3 0.01 260)' },
  { value: 'sand', label: 'Sand', swatch: 'oklch(0.84 0.035 80)' },
  { value: 'sage', label: 'Sage', swatch: 'oklch(0.68 0.045 150)' },
] as const;

type Colour = (typeof COLOURS)[number]['value'];

const SIZES = ['S', 'M', 'L', 'XL'] as const;

type Size = (typeof SIZES)[number];

const STOCK: Record<Colour, Record<Size, number>> = {
  graphite: { S: 12, M: 3, L: 8, XL: 0 },
  sand: { S: 0, M: 6, L: 2, XL: 5 },
  sage: { S: 4, M: 0, L: 0, XL: 9 },
};

const DETAILS = [
  {
    value: 'details',
    title: 'Details',
    body: '40 mm drivers, active noise cancelling with a transparency mode, and 32 hours of playback per charge. Ten minutes on USB-C gives you four hours. Pairs with two devices at once.',
  },
  {
    value: 'materials',
    title: 'Materials & care',
    body: 'Protein leather cushions over memory foam, an aluminium headband slider and a recycled nylon case. Wipe the cushions with a damp cloth. Replacement cushions are $29 a pair.',
  },
  {
    value: 'shipping',
    title: 'Shipping & returns',
    body: 'Free standard shipping on orders over $200, otherwise $8. Returns are free for 60 days if the headphones come back in their case. Covered by a two-year warranty.',
  },
] as const;

const MAX_WITHOUT_SIZE = 10;

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const subscribeNever = () => () => {};

const getDeliveryDate = () => {
  const date = new Date();
  let businessDays = 4;
  while (businessDays > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) businessDays -= 1;
  }

  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
};

const getServerDeliveryDate = () => null;

const Ecommerce03 = () => {
  const [view, setView] = React.useState(0);
  const [colour, setColour] = React.useState<Colour>('graphite');
  const [size, setSize] = React.useState<Size | ''>('');
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const addedTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const deliveryDate = React.useSyncExternalStore(subscribeNever, getDeliveryDate, getServerDeliveryDate);

  React.useEffect(() => () => clearTimeout(addedTimer.current), []);

  const colourLabel = COLOURS.find((c) => c.value === colour)?.label ?? '';
  const soldOut = SIZES.filter((s) => STOCK[colour][s] === 0);
  const stock = size ? STOCK[colour][size] : MAX_WITHOUT_SIZE;
  const clampedQuantity = Math.min(Math.max(quantity, 1), stock);

  const showView = (next: number) => setView((next + VIEWS.length) % VIEWS.length);

  const changeColour = (next: unknown) => {
    const nextColour = next as Colour;
    setColour(nextColour);
    if (size && STOCK[nextColour][size] === 0) setSize('');
  };

  const changeQuantity = (next: number) => {
    if (Number.isNaN(next)) return;
    setQuantity(Math.min(Math.max(next, 1), stock));
  };

  const addToCart = () => {
    clearTimeout(addedTimer.current);
    setAdded(true);
    addedTimer.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section data-slot="product-detail" className="bg-background py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div data-slot="product-gallery" className={cn(ENTER, 'flex flex-col gap-3 lg:sticky lg:top-8 lg:self-start')}>
          <div className="group/gallery relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            {VIEWS.map((item, index) => (
              <Image
                key={item.label}
                src={PHOTO}
                alt={`Atlas Wireless Headphones, ${item.label.toLowerCase()} view`}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                aria-hidden={index !== view}
                style={{ transform: `scale(${item.scale})`, transformOrigin: item.origin }}
                className={cn(
                  'object-cover object-[70%_50%] transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                  index === view ? 'opacity-100' : 'opacity-0',
                )}
              />
            ))}
            <span
              dir="ltr"
              className="absolute start-3 top-3 rounded-md bg-background/85 px-2 py-1 text-xs text-muted-foreground tabular-nums backdrop-blur"
            >
              {formatIndex(view)}
              <span className="mx-1.5 text-border">|</span>
              {formatIndex(VIEWS.length - 1)}
            </span>
            <div className="absolute end-3 bottom-3 flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Previous view"
                onClick={() => showView(view - 1)}
              >
                <ChevronLeft className="rtl:rotate-180" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Next view"
                onClick={() => showView(view + 1)}
              >
                <ChevronRight className="rtl:rotate-180" />
              </Button>
            </div>
          </div>

          <div
            data-slot="product-thumbnails"
            style={stagger(0, 0, 160)}
            className={cn(ENTER, 'grid grid-cols-4 gap-3')}
          >
            {VIEWS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-label={`Show ${item.label.toLowerCase()} view`}
                aria-current={index === view}
                onClick={() => setView(index)}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-md border border-border bg-muted ring-offset-2 ring-offset-background transition-[box-shadow,opacity] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  index === view ? 'ring-2 ring-foreground' : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image
                  src={PHOTO}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 25vw"
                  style={{ transform: `scale(${item.scale})`, transformOrigin: item.origin }}
                  className="object-cover object-[70%_50%]"
                />
              </button>
            ))}
          </div>
        </div>

        <div data-slot="product-info" className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Breadcrumb className={ENTER}>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Shop</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Audio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Atlas Wireless</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2
              style={stagger(1)}
              className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
            >
              Atlas Wireless Headphones
            </h2>
            <div style={stagger(2)} className={cn(ENTER, 'flex items-center gap-2 text-sm')}>
              <Rating value={4.7} step={0.5} readOnly size="sm" aria-label="Rated 4.7 out of 5" />
              <span className="tabular-nums">4.7</span>
              <a
                href="#reviews"
                className="text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
              >
                (214 reviews)
              </a>
            </div>
            <div style={stagger(3)} className={cn(ENTER, 'flex flex-wrap items-baseline gap-x-3 gap-y-2')}>
              <span className="text-2xl font-semibold tabular-nums">$249</span>
              <span className="text-base text-muted-foreground tabular-nums line-through">
                <span className="sr-only">Was </span>$299
              </span>
              <Badge variant="outline" className="self-center">
                Save $50
              </Badge>
            </div>
          </div>

          <div style={stagger(4)} className={cn(ENTER, 'flex flex-col gap-6 border-t border-border pt-8')}>
            <div data-slot="product-colour" className="flex flex-col gap-3">
              <p id="ecommerce-03-colour" className="text-sm font-medium">
                Colour <span className="font-normal text-muted-foreground">{colourLabel}</span>
              </p>
              <RadioGroup
                aria-labelledby="ecommerce-03-colour"
                value={colour}
                onValueChange={changeColour}
                className="flex"
              >
                {COLOURS.map((option) => (
                  <RadioGroupItem
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                    style={{ backgroundColor: option.swatch }}
                    className="size-8"
                  />
                ))}
              </RadioGroup>
            </div>

            <div data-slot="product-size" className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <p id="ecommerce-03-size" className="text-sm font-medium">
                  Headband size
                </p>
                <a
                  href="#size-guide"
                  className="text-xs text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
                >
                  Size guide
                </a>
              </div>
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={2}
                aria-labelledby="ecommerce-03-size"
                value={size}
                onValueChange={(next) => next && setSize(next as Size)}
                className="grid w-full grid-cols-4"
              >
                {SIZES.map((option) => {
                  const unavailable = STOCK[colour][option] === 0;

                  return (
                    <ToggleGroupItem
                      key={option}
                      value={option}
                      disabled={unavailable}
                      aria-label={unavailable ? `${option}, sold out in ${colourLabel}` : option}
                      className="h-10 w-full"
                    >
                      {option}
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              <p className="min-h-4 text-xs text-muted-foreground">
                {soldOut.length > 0
                  ? `${soldOut.join(' and ')} sold out in ${colourLabel}`
                  : `Every size in stock in ${colourLabel}`}
              </p>
            </div>

            <div data-slot="product-quantity" className="flex flex-col gap-3">
              <label htmlFor="ecommerce-03-quantity" className="text-sm font-medium">
                Quantity
              </label>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <InputGroup className="w-32">
                  <InputGroupAddon>
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Decrease quantity"
                      disabled={clampedQuantity <= 1}
                      onClick={() => changeQuantity(clampedQuantity - 1)}
                    >
                      <Minus />
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="ecommerce-03-quantity"
                    inputMode="numeric"
                    value={clampedQuantity}
                    onChange={(event) => changeQuantity(Number.parseInt(event.target.value, 10))}
                    className="text-center"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Increase quantity"
                      disabled={clampedQuantity >= stock}
                      onClick={() => changeQuantity(clampedQuantity + 1)}
                    >
                      <Plus />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {size && stock <= 3 && (
                  <span key={`${colour}-${size}`} className={cn(SWAP, 'text-sm text-warning')}>
                    Only {stock} left
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" size="lg" disabled={!size} onClick={addToCart} className="flex-1">
                {added ? (
                  <span key="added" className={cn(SWAP, 'inline-flex items-center gap-2')}>
                    <Check />
                    Added
                  </span>
                ) : (
                  <span key="add" className={cn(SWAP, 'inline-flex items-center gap-2')}>
                    <ShoppingBag />
                    {size ? 'Add to cart' : 'Choose a size'}
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => setSaved((prev) => !prev)}
              >
                <Heart className={cn('transition-transform duration-150', saved && 'scale-110 fill-current')} />
              </Button>
            </div>
            <p aria-live="polite" className="sr-only">
              {added ? `Added ${clampedQuantity} to your cart` : ''}
            </p>

            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Truck aria-hidden className="size-4 shrink-0" />
                <span>
                  Order today, arrives by{' '}
                  {deliveryDate ? (
                    <span className="font-medium text-foreground">{deliveryDate}</span>
                  ) : (
                    <span aria-hidden className="inline-block h-3.5 w-20 translate-y-0.5 rounded bg-muted" />
                  )}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <RotateCcw aria-hidden className="size-4 shrink-0" />
                Free returns for 60 days
              </li>
            </ul>
          </div>

          <Accordion type="single" collapsible defaultValue="details" style={stagger(5)} className={ENTER}>
            {DETAILS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Ecommerce03;
