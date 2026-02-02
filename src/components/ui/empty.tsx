import * as React from "react"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-h-96 flex-col items-center justify-center p-6 text-center",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex flex-col items-center gap-3", className)}
      {...props}
    />
  )
}

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "icon"
}) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        "flex items-center justify-center",
        variant === "icon" &&
          "bg-muted text-muted-foreground size-12 rounded-full [&_svg]:size-6",
        className
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("mt-6 flex flex-col items-center gap-3", className)}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}
