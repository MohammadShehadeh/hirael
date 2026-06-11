"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/hirael/ui/empty-state"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { Separator } from "@/registry/hirael/ui/separator"

type LineItem = {
  id: string
  name: string
  variant: string
  price: number
  qty: number
  image: string
}

const INITIAL_ITEMS: readonly LineItem[] = [
  {
    id: "atlas-headphones",
    name: "Atlas Over-Ear Headphones",
    variant: "Graphite",
    price: 249,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "meridian-watch",
    name: "Meridian Chrono Watch",
    variant: "Steel · 40mm",
    price: 389,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "hydra-bottle",
    name: "Hydra Steel Bottle",
    variant: "Matte black · 750ml",
    price: 32,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop",
  },
]

const PROMO_CODE = "HIRAEL10"
const PROMO_RATE = 0.1
const FREE_SHIPPING_OVER = 200
const SHIPPING_FLAT = 12

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" })

export default function Ecommerce02() {
  const [items, setItems] = React.useState<readonly LineItem[]>(INITIAL_ITEMS)
  const [code, setCode] = React.useState("")
  const [promoApplied, setPromoApplied] = React.useState(false)
  const [promoError, setPromoError] = React.useState(false)

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = promoApplied ? subtotal * PROMO_RATE : 0
  const shipping =
    items.length === 0 || subtotal - discount >= FREE_SHIPPING_OVER
      ? 0
      : SHIPPING_FLAT
  const total = subtotal - discount + shipping

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    )

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const applyPromo = () => {
    if (code.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true)
      setPromoError(false)
    } else {
      setPromoError(true)
    }
  }

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
              · cart
            </span>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
              Almost yours.
            </h2>
          </div>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.1em] text-muted-foreground">
            {count} item{count === 1 ? "" : "s"}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState>
            <EmptyStateMedia>
              <ShoppingBag />
            </EmptyStateMedia>
            <EmptyStateTitle>Your cart is empty</EmptyStateTitle>
            <EmptyStateDescription>
              Everything you remove ends up here as free shelf space. Refill
              it with the demo order to keep exploring.
            </EmptyStateDescription>
            <EmptyStateActions>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems(INITIAL_ITEMS)}
              >
                Restore demo cart
              </Button>
            </EmptyStateActions>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <ul className="flex flex-col border-t border-border lg:col-span-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 border-b border-border py-5 sm:gap-5"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:size-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="truncate text-sm font-medium tracking-[-0.01em]">
                      {item.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {item.variant}
                    </span>
                    <div className="mt-2 inline-flex w-fit items-center rounded-sm border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-e-none"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center font-mono text-xs tabular-nums">
                        {item.qty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-s-none"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="size-3.5" />
                    </Button>
                    <span className="font-mono text-sm font-medium tabular-nums">
                      {usd(item.price * item.qty)}
                    </span>
                    {item.qty > 1 && (
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {usd(item.price)} each
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <Card className="h-fit lg:sticky lg:top-6">
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  · order summary
                </CardDescription>
                <CardTitle className="sr-only">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {usd(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500">
                      Free
                    </span>
                  ) : (
                    <span className="font-mono tabular-nums">
                      {usd(shipping)}
                    </span>
                  )}
                </div>
                {promoApplied && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      Discount · {PROMO_CODE}
                      <button
                        type="button"
                        onClick={() => setPromoApplied(false)}
                        aria-label="Remove promo code"
                        className="inline-flex size-4 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        <X className="size-2.5" />
                      </button>
                    </span>
                    <span className="font-mono tabular-nums text-emerald-500">
                      −{usd(discount)}
                    </span>
                  </div>
                )}
                {shipping > 0 && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {usd(FREE_SHIPPING_OVER - (subtotal - discount))} away from
                    free shipping
                  </p>
                )}

                <Separator className="my-1" />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-mono text-xl font-semibold tabular-nums tracking-[-0.02em]">
                    {usd(total)}
                  </span>
                </div>

                {!promoApplied && (
                  <div className="flex flex-col gap-1.5">
                    <InputGroup>
                      <InputGroupInput
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value)
                          setPromoError(false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") applyPromo()
                        }}
                        placeholder="Promo code"
                        aria-label="Promo code"
                        aria-invalid={promoError}
                        className="font-mono text-xs uppercase"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton size="sm" onClick={applyPromo}>
                          Apply
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {promoError ? (
                      <p className="text-xs text-red-500">
                        That code isn&apos;t recognized. Try {PROMO_CODE}.
                      </p>
                    ) : (
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        Hint · {PROMO_CODE} takes 10% off
                      </p>
                    )}
                  </div>
                )}

                <Button className="mt-1 w-full">
                  Checkout · {usd(total)}
                  <ArrowRight className="size-4" />
                </Button>
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Free returns · 2-year warranty · secure checkout
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
