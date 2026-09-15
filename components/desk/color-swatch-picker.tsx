"use client"

import { cn } from "cn"
import { CheckIcon } from "lucide-react"

import { SWATCH_COLORS } from "@/lib/colors"

function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SWATCH_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === color && "ring-2 ring-foreground"
          )}
          style={{ backgroundColor: color }}
          aria-label={color}
          aria-pressed={value === color}
        >
          {value === color && <CheckIcon className="size-4 text-white" />}
        </button>
      ))}
    </div>
  )
}

export { ColorSwatchPicker }
