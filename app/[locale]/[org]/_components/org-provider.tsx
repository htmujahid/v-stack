"use client"

import { createContext, useContext } from "react"

type OrgMember = {
  id: string
  role: string
}

type OrgContextValue = {
  organization: {
    id: string
    name: string
    slug: string
    logo: string | null
  }
  member: OrgMember
  roles: string[]
  permissions: {
    canReadAc: boolean
    canManageTeams: boolean
    canManageMembers: boolean
    canManageOrganization: boolean
  }
}

const OrgContext = createContext<OrgContextValue | null>(null)

function OrgProvider({
  value,
  children,
}: {
  value: OrgContextValue
  children: React.ReactNode
}) {
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

function useOrg() {
  const context = useContext(OrgContext)
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider")
  }
  return context
}

export { OrgProvider, useOrg }
export type { OrgContextValue }
