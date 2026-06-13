"use client"

import { ImageIcon, Link2, Plus, Type } from "lucide-react"

import {
  FloatingActionButton,
  FloatingActionButtonItem,
  FloatingActionButtonList,
  FloatingActionButtonTrigger,
} from "@/registry/hirael/ui/floating-action-button"

export default function FloatingActionButtonDemo() {
  return (
    <div className="flex h-60 w-full max-w-xl items-end justify-center">
      <FloatingActionButton>
        <FloatingActionButtonList>
          <FloatingActionButtonItem index={2} aria-label="Add text">
            <Type />
          </FloatingActionButtonItem>
          <FloatingActionButtonItem index={1} aria-label="Add image">
            <ImageIcon />
          </FloatingActionButtonItem>
          <FloatingActionButtonItem index={0} aria-label="Add link">
            <Link2 />
          </FloatingActionButtonItem>
        </FloatingActionButtonList>
        <FloatingActionButtonTrigger aria-label="Create">
          <Plus />
        </FloatingActionButtonTrigger>
      </FloatingActionButton>
    </div>
  )
}
