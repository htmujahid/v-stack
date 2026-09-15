"use client"

import { createContext, useContext } from "react"

import type { Session } from "@/lib/auth"

type AuthContextValue = {
  session: Session["session"] | null
  user: Session["user"] | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

function AuthProvider({
  initialSession,
  children,
}: {
  initialSession: Session | null
  children: React.ReactNode
}) {
  return (
    <AuthContext.Provider
      value={{
        session: initialSession?.session ?? null,
        user: initialSession?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
