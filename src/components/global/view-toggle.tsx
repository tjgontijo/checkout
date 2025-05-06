"use client"

import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
      <Toggle
        size="sm"
        pressed={view === "grid"}
        onPressedChange={() => onViewChange("grid")}
        className={cn(
          "data-[state=on]:bg-background",
          "hover:bg-background/60"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={view === "list"}
        onPressedChange={() => onViewChange("list")}
        className={cn(
          "data-[state=on]:bg-background",
          "hover:bg-background/60"
        )}
      >
        <List className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
