import type { Metadata } from "next"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

import "./globals.css"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or may have moved.",
}

const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
          <h1 className="text-lg font-semibold">Page not found</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved.
          </p>
          <Link href="/" className={buttonVariants()}>
            Go home
          </Link>
        </div>
      </body>
    </html>
  )
}
