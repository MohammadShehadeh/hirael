'use client';

import * as React from 'react';
import Image from 'next/image';
import { ArrowRight, CircleCheck, Loader2, Minus, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/hirael/bases/radix/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/radix/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface LineItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image: string;
}

const INITIAL_ITEMS: readonly LineItem[] = [
  {
    id: 'atlas-headphones',
    name: 'Atlas Over-Ear Headphones',
    variant: 'Graphite',
    price: 249,
    qty: 1,
    image: '/media/blocks/ecommerce-02/atlas-headphones.jpg',
  },
  {
    id: 'meridian-watch',
    name: 'Meridian Chrono Watch',
    variant: 'Steel, 40mm',
    price: 389,
    qty: 1,
    image: '/media/blocks/ecommerce-02/meridian-watch.jpg',
  },
  {
    id: 'hydra-bottle',
    name: 'Hydra Steel Bottle',
    variant: 'Matte black, 750ml',
    price: 32,
    qty: 2,
    image: '/media/blocks/ecommerce-02/hydra-bottle.jpg',
  },
];

const PROMO_CODE = 'HIRAEL10';
const PROMO_RATE = 0.1;
const FREE_SHIPPING_OVER = 200;
const SHIPPING_FLAT = 12;
const MAX_QTY = 10;
const REMOVE_MS = 220;
const CHECKOUT_MS = 1200;
const ORDER_NUMBER = 'HR-20417';

type CheckoutState = 'idle' | 'pending' | 'placed';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const Ecommerce02 = () => {
  const [items, setItems] = React.useState<readonly LineItem[]>(INITIAL_ITEMS);
  const [removing, setRemoving] = React.useState<readonly string[]>([]);
  const [code, setCode] = React.useState('');
  const [promoApplied, setPromoApplied] = React.useState(false);
  const [promoError, setPromoError] = React.useState(false);
  const [checkout, setCheckout] = React.useState<CheckoutState>('idle');
  const [placedTotal, setPlacedTotal] = React.useState(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const active = items.filter((i) => !removing.includes(i.id));
  const count = active.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = active.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * PROMO_RATE : 0;
  const shipping = active.length === 0 || subtotal - discount >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const total = subtotal - discount + shipping;

  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, Math.max(1, qty)) } : i)));

  const removeItem = (id: string) => {
    setRemoving((prev) => [...prev, id]);
    later(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemoving((prev) => prev.filter((r) => r !== id));
    }, REMOVE_MS);
  };

  const applyPromo = () => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
    }
  };

  const placeOrder = () => {
    if (checkout !== 'idle' || active.length === 0) return;
    setCheckout('pending');
    later(() => {
      setPlacedTotal(total);
      setCheckout('placed');
    }, CHECKOUT_MS);
  };

  const startOver = () => {
    setItems(INITIAL_ITEMS);
    setPromoApplied(false);
    setCode('');
    setCheckout('idle');
  };

  const pending = checkout === 'pending';

  return (
    <section data-slot="ecommerce" className="bg-background py-20 sm:py-28">
      <div className="container flex w-full flex-col gap-10">
        <div data-slot="ecommerce-header" className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Cart</span>
            <h2
              style={stagger(1, 70)}
              className={cn(
                ENTER,
                'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl',
              )}
            >
              {checkout === 'placed' ? 'On its way.' : 'Almost yours.'}
            </h2>
          </div>
          {checkout !== 'placed' && (
            <span
              style={stagger(2, 70)}
              aria-live="polite"
              className={cn(ENTER, 'text-xs tabular-nums uppercase text-muted-foreground')}
            >
              {count} item{count === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {checkout === 'placed' ? (
          <div
            data-slot="ecommerce-order-placed"
            role="status"
            className={cn(SWAP, 'flex max-w-xl flex-col gap-6 border-t border-border pt-8')}
          >
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-lg font-medium tracking-tight">
                <CircleCheck aria-hidden className="size-5 shrink-0 text-success" />
                Order placed
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                We sent a receipt to your email and will write again when the parcel ships, usually within two working
                days.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 text-sm">
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase text-muted-foreground">Order number</dt>
                <dd dir="ltr" className="text-start font-medium tabular-nums">
                  {ORDER_NUMBER}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase text-muted-foreground">Charged</dt>
                <dd className="font-medium tabular-nums">{usd(placedTotal)}</dd>
              </div>
            </dl>
            <Button variant="outline" size="sm" className="w-fit" onClick={startOver}>
              Start a new order
            </Button>
          </div>
        ) : items.length === 0 ? (
          <Empty data-slot="ecommerce-empty" className={SWAP}>
            <EmptyHeader>
              <EmptyTitle>Your cart is empty</EmptyTitle>
              <EmptyDescription>
                The headphones, watch and bottles you removed are still in stock if you change your mind.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={() => setItems(INITIAL_ITEMS)}>
                Put them back
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <ul data-slot="ecommerce-cart-items" className="flex flex-col border-t border-border lg:col-span-2">
              {items.map((item, index) => {
                const leaving = removing.includes(item.id);
                return (
                  <li
                    key={item.id}
                    data-slot="ecommerce-cart-item"
                    data-removing={leaving || undefined}
                    className={cn(
                      'grid grid-rows-[1fr] transition-[grid-template-rows,opacity,translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      leaving && 'grid-rows-[0fr] translate-x-2 opacity-0 rtl:-translate-x-2',
                    )}
                    aria-hidden={leaving || undefined}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        style={stagger(index, 60, 200)}
                        className={cn(ENTER, 'flex items-start gap-4 border-b border-border py-5 sm:gap-5')}
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:size-24">
                          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <h3 className="text-sm font-medium tracking-[-0.01em] text-pretty">{item.name}</h3>
                          <span className="text-xs uppercase text-muted-foreground">{item.variant}</span>
                          <div className="mt-2 inline-flex w-fit items-center rounded-sm border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => setQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1 || leaving || pending}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-8 text-center text-xs tabular-nums" aria-live="polite">
                              {item.qty}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => setQty(item.id, item.qty + 1)}
                              disabled={item.qty >= MAX_QTY || leaving || pending}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          {item.qty >= MAX_QTY && (
                            <span className={cn(SWAP, 'text-xs text-muted-foreground')}>
                              Limit of {MAX_QTY} per order
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => removeItem(item.id)}
                            disabled={leaving || pending}
                            aria-label={`Remove ${item.name}`}
                          >
                            <X className="size-3.5" />
                          </Button>
                          <span className="text-sm font-medium tabular-nums">{usd(item.price * item.qty)}</span>
                          {item.qty > 1 && (
                            <span className="text-[10px] tabular-nums text-muted-foreground">
                              {usd(item.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Card
              data-slot="ecommerce-summary"
              style={stagger(0, 0, 320)}
              className={cn(ENTER, 'h-fit lg:sticky lg:top-6')}
            >
              <CardHeader>
                <CardDescription>Order summary</CardDescription>
                <CardTitle className="sr-only">Order summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{usd(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-xs uppercase text-success">Free</span>
                    ) : (
                      <span className="tabular-nums">{usd(shipping)}</span>
                    )}
                  </div>
                  {promoApplied && (
                    <div className={cn(SWAP, 'flex items-center justify-between text-sm')}>
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <span>Discount</span>
                        <span className="text-xs uppercase">{PROMO_CODE}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-xs"
                          onClick={() => setPromoApplied(false)}
                          disabled={pending}
                          aria-label="Remove promo code"
                          className="size-4"
                        >
                          <X className="size-2.5" />
                        </Button>
                      </span>
                      <span className="tabular-nums text-success">−{usd(discount)}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {usd(FREE_SHIPPING_OVER - (subtotal - discount))} away from free shipping
                    </p>
                  )}

                  <Separator className="my-1" />

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-xl font-semibold tabular-nums tracking-[-0.02em]">{usd(total)}</span>
                  </div>

                  {!promoApplied && (
                    <div className="flex flex-col gap-1.5">
                      <InputGroup>
                        <InputGroupInput
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setPromoError(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') applyPromo();
                          }}
                          placeholder="Promo code"
                          aria-label="Promo code"
                          aria-invalid={promoError}
                          aria-describedby="ecommerce-02-promo-help"
                          disabled={pending}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton size="sm" onClick={applyPromo} disabled={pending}>
                            Apply
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      <p
                        id="ecommerce-02-promo-help"
                        key={promoError ? 'error' : 'help'}
                        className={cn(SWAP, 'text-xs', promoError ? 'text-destructive' : 'text-muted-foreground')}
                      >
                        {promoError ? (
                          <>That code isn&apos;t recognized. Try {PROMO_CODE}.</>
                        ) : (
                          <>Try {PROMO_CODE} for 10% off</>
                        )}
                      </p>
                    </div>
                  )}

                  <Button
                    data-slot="ecommerce-checkout"
                    className="group mt-1 w-full"
                    onClick={placeOrder}
                    disabled={pending || active.length === 0}
                    aria-busy={pending || undefined}
                  >
                    {pending ? (
                      <span key="pending" className={cn(SWAP, 'inline-flex items-center gap-2')}>
                        <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
                        Placing order…
                      </span>
                    ) : (
                      <span key="idle" className="inline-flex items-center gap-2">
                        Checkout
                        <span className="tabular-nums">{usd(total)}</span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        />
                      </span>
                    )}
                  </Button>
                  <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs uppercase text-muted-foreground">
                    <span>Free returns</span>
                    <span aria-hidden className="text-border">
                      |
                    </span>
                    <span>2-year warranty</span>
                    <span aria-hidden className="text-border">
                      |
                    </span>
                    <span>Secure checkout</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Ecommerce02;
