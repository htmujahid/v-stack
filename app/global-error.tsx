"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"

import "./globals.css"

const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error must include html and body tags
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            An unexpected error occurred. Try again, or head back home.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => retry()}>
              Try again
            </Button>
            <Link href="/" className={buttonVariants()}>
              Go home
            </Link>
          </div>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Error reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
