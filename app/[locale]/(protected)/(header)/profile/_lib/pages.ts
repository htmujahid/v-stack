export const profilePages = [
  { href: "/profile", key: "general" },
  { href: "/profile/security", key: "security" },
  { href: "/profile/sessions", key: "sessions" },
  { href: "/profile/danger", key: "danger" },
] as const

export type ProfilePageKey = (typeof profilePages)[number]["key"]
