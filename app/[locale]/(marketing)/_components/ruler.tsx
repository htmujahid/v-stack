import { cn } from "cn"

function Ruler({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  if (orientation === "vertical") {
    return (
      <div aria-hidden="true" className={cn("relative w-6", className)}>
        <div className="absolute inset-y-0 left-0 w-2 bg-[repeating-linear-gradient(to_bottom,var(--border)_0,var(--border)_1px,transparent_1px,transparent_8px)]" />
        <div className="absolute inset-y-0 left-0 w-4 bg-[repeating-linear-gradient(to_bottom,var(--primary)_0,var(--primary)_1px,transparent_1px,transparent_56px)] opacity-40" />
        <div className="absolute inset-y-0 left-0 w-6 bg-[repeating-linear-gradient(to_bottom,var(--border)_0,var(--border)_1px,transparent_1px,transparent_112px)]" />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className={cn("relative h-6", className)}>
      <div className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(to_right,var(--border)_0,var(--border)_1px,transparent_1px,transparent_8px)]" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-[repeating-linear-gradient(to_right,var(--primary)_0,var(--primary)_1px,transparent_1px,transparent_56px)] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-[repeating-linear-gradient(to_right,var(--border)_0,var(--border)_1px,transparent_1px,transparent_112px)]" />
    </div>
  )
}

export { Ruler }
