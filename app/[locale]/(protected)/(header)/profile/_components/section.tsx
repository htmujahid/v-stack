import { cn } from "@/lib/utils"

function SectionGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 [&>section+section]:border-t [&>section+section]:pt-6 sm:[&>section+section]:pt-8">
      {children}
    </div>
  )
}

function Section({
  title,
  description,
  destructive = false,
  children,
}: {
  title: string
  description: string
  destructive?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2
          className={cn(
            "text-base font-medium",
            destructive && "text-destructive"
          )}
        >
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "rounded-lg border bg-card p-4 sm:p-5",
          destructive && "border-destructive/50"
        )}
      >
        {children}
      </div>
    </section>
  )
}

export { Section, SectionGroup }
