"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ResizableDirection = "horizontal" | "vertical"

const ResizableContext = React.createContext<ResizableDirection>("horizontal")

type ResizablePanelGroupProps = React.ComponentProps<"div"> & {
  direction?: ResizableDirection
}

function ResizablePanelGroup({
  direction = "horizontal",
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizableContext.Provider value={direction}>
      <div
        data-slot="resizable-panel-group"
        data-direction={direction}
        className={cn(
          "flex min-h-0 min-w-0",
          direction === "vertical" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      />
    </ResizableContext.Provider>
  )
}

type ResizablePanelProps = React.ComponentProps<"div"> & {
  /** Initial size as a proportion shared across sibling panels. */
  defaultSize?: number
  /** Minimum size as a percentage of the group. */
  minSize?: number
}

function ResizablePanel({
  defaultSize = 50,
  minSize = 10,
  className,
  style,
  ...props
}: ResizablePanelProps) {
  return (
    <div
      data-slot="resizable-panel"
      data-min-size={minSize}
      className={cn("min-h-0 min-w-0 overflow-auto", className)}
      style={{ flexGrow: defaultSize, flexShrink: 1, flexBasis: 0, ...style }}
      {...props}
    />
  )
}

type ResizableHandleProps = React.ComponentProps<"div">

function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  const direction = React.useContext(ResizableContext)
  const isHorizontal = direction === "horizontal"

  const resize = (handle: HTMLElement, deltaPx: number) => {
    const prev = handle.previousElementSibling as HTMLElement | null
    const next = handle.nextElementSibling as HTMLElement | null
    const group = handle.parentElement
    if (!prev || !next || !group) return
    const groupSize = isHorizontal ? group.clientWidth : group.clientHeight
    const prevSize = isHorizontal ? prev.clientWidth : prev.clientHeight
    const nextSize = isHorizontal ? next.clientWidth : next.clientHeight
    const totalSize = prevSize + nextSize
    const prevGrow = parseFloat(prev.style.flexGrow || "1")
    const nextGrow = parseFloat(next.style.flexGrow || "1")
    const totalGrow = prevGrow + nextGrow
    const prevMin = (parseFloat(prev.dataset.minSize || "0") / 100) * groupSize
    const nextMin = (parseFloat(next.dataset.minSize || "0") / 100) * groupSize
    let newPrev = prevSize + deltaPx
    newPrev = Math.max(prevMin, Math.min(totalSize - nextMin, newPrev))
    const newPrevGrow = (newPrev / totalSize) * totalGrow
    prev.style.flexGrow = String(newPrevGrow)
    next.style.flexGrow = String(totalGrow - newPrevGrow)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const rtl = isHorizontal && getComputedStyle(handle).direction === "rtl"
    let last = isHorizontal ? event.clientX : event.clientY
    const onMove = (ev: PointerEvent) => {
      const current = isHorizontal ? ev.clientX : ev.clientY
      let delta = current - last
      if (rtl) delta = -delta
      last = current
      resize(handle, delta)
    }
    const onUp = (ev: PointerEvent) => {
      handle.releasePointerCapture(ev.pointerId)
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const handle = event.currentTarget
    const group = handle.parentElement
    if (!group) return
    const rtl = isHorizontal && getComputedStyle(handle).direction === "rtl"
    const step = event.shiftKey ? 0.1 : 0.02
    const groupSize = isHorizontal ? group.clientWidth : group.clientHeight
    let dir = 0
    if (isHorizontal) {
      if (event.key === "ArrowLeft") dir = -1
      else if (event.key === "ArrowRight") dir = 1
      if (rtl) dir = -dir
    } else {
      if (event.key === "ArrowUp") dir = -1
      else if (event.key === "ArrowDown") dir = 1
    }
    if (dir !== 0) {
      event.preventDefault()
      resize(handle, dir * step * groupSize)
    }
  }

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={isHorizontal ? "vertical" : "horizontal"}
      data-slot="resizable-handle"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        "relative shrink-0 bg-border transition-colors hover:bg-ring focus-visible:bg-ring focus-visible:outline-none",
        isHorizontal
          ? "w-px cursor-col-resize before:absolute before:inset-y-0 before:-inset-x-1"
          : "h-px cursor-row-resize before:absolute before:inset-x-0 before:-inset-y-1",
        className
      )}
      {...props}
    />
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
