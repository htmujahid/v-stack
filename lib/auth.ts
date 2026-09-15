import { apiKey } from "@better-auth/api-key"
import { i18n, locales } from "@better-auth/i18n"
import { APIError, type BetterAuthOptions, betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { openAPI } from "better-auth/plugins"
import { admin } from "better-auth/plugins/admin"
import { emailOTP } from "better-auth/plugins/email-otp"
import { magicLink } from "better-auth/plugins/magic-link"
import { organization } from "better-auth/plugins/organization"
import { twoFactor } from "better-auth/plugins/two-factor"
import { username } from "better-auth/plugins/username"
import "dotenv/config"

import { db } from "@/db"
import { sendEmail } from "@/lib/email"
import { isReservedOrgSlug, orgAc, orgRoles } from "@/lib/org-permissions"
import { ADMIN_ROLES, DEFAULT_ROLE, ac, roles } from "@/lib/permissions"
import { redis } from "@/lib/redis"
import { isSocialProvider } from "@/lib/social-providers"

export const auth = betterAuth({
  appName: "v-stack",
  database: drizzleAdapter(db, { provider: "pg" }),
  secondaryStorage: {
    get: async (key) => redis.get(key),
    getAndDelete: async (key) => redis.getdel(key),
    increment: async (key, ttl) =>
      (await redis.eval(
        "local v = redis.call('INCR', KEYS[1]) if v == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end return v",
        1,
        key,
        ttl
      )) as number,
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, "EX", ttl)
      } else {
        await redis.set(key, value)
      }
    },
    delete: async (key) => {
      await redis.del(key)
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your v-stack password",
        text: `Hi ${user.name},\n\nClick the link below to reset your password. The link expires in one hour.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your v-stack email address",
        text: `Hi ${user.name},\n\nWelcome to v-stack! Click the link below to verify your email address.\n\n${url}\n\nIf you didn't create an account, you can safely ignore this email.`,
      })
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Approve your v-stack email change",
          text: `Hi ${user.name},\n\nYou asked to change your account email to ${newEmail}. Click the link below to approve this change.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email and your address will stay the same.`,
        })
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Confirm deleting your v-stack account",
          text: `Hi ${user.name},\n\nClick the link below to permanently delete your v-stack account. This cannot be undone.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
        })
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] as string,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    magicLink({
      disableSignUp: true,
      storeToken: "hashed",
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "Your v-stack sign-in link",
          text: `Click the link below to sign in to v-stack. The link expires in 5 minutes and can be used once.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
        })
      },
    }),
    emailOTP({
      disableSignUp: true,
      storeOTP: "encrypted",
      sendVerificationOTP: async ({ email, otp, type }) => {
        const subjects: Record<typeof type, string> = {
          "sign-in": "Your v-stack sign-in code",
          "email-verification": "Verify your v-stack email address",
          "forget-password": "Your v-stack password reset code",
          "change-email": "Your v-stack email change code",
        }
        await sendEmail({
          to: email,
          subject: subjects[type],
          text: `Your v-stack verification code is: ${otp}\n\nIt expires in 5 minutes. If you didn't request this, you can safely ignore this email.`,
        })
      },
    }),
    admin({
      ac,
      roles,
      defaultRole: DEFAULT_ROLE,
      adminRoles: [...ADMIN_ROLES],
      impersonationSessionDuration: 60 * 60,
      bannedUserMessage:
        "Your v-stack account has been suspended. Contact support if you believe this is a mistake.",
    }),
    twoFactor({
      issuer: "v-stack",
      otpOptions: {
        storeOTP: "encrypted",
        sendOTP: async ({ user, otp }) => {
          await sendEmail({
            to: user.email,
            subject: "Your v-stack verification code",
            text: `Hi ${user.name},\n\nYour v-stack verification code is: ${otp}\n\nIt expires in 3 minutes. If you didn't try to sign in, change your password immediately.`,
          })
        },
      },
      backupCodeOptions: {
        storeBackupCodes: "encrypted",
      },
    }),
    organization({
      ac: orgAc,
      roles: orgRoles,
      allowUserToCreateOrganization: async (user) =>
        user.emailVerified === true,
      organizationLimit: 5,
      membershipLimit: 100,
      creatorRole: "owner",
      teams: {
        enabled: true,
        maximumTeams: 20,
        maximumMembersPerTeam: 50,
        allowRemovingAllTeams: false,
      },
      dynamicAccessControl: {
        enabled: true,
        maximumRolesPerOrganization: 20,
      },
      invitationExpiresIn: 60 * 60 * 24 * 7,
      invitationLimit: 50,
      cancelPendingInvitationsOnReInvite: true,
      sendInvitationEmail: async ({
        email,
        organization: org,
        inviter,
        invitation,
      }) => {
        await sendEmail({
          to: email,
          subject: `You've been invited to join ${org.name} on v-stack`,
          text: `Hi,\n\n${inviter.user.name} invited you to join ${org.name} on v-stack. Click the link below to accept the invitation.\n\n${process.env["BETTER_AUTH_URL"] ?? ""}/accept-invitation/${invitation.id}\n\nIf you weren't expecting this, you can safely ignore this email.`,
        })
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization: org }) => {
          if (org.slug && isReservedOrgSlug(org.slug)) {
            throw new APIError("BAD_REQUEST", {
              message:
                "This organization URL is reserved. Please choose another.",
            })
          }
        },
        beforeUpdateOrganization: async ({ organization: org }) => {
          if (org.slug && isReservedOrgSlug(org.slug)) {
            throw new APIError("BAD_REQUEST", {
              message:
                "This organization URL is reserved. Please choose another.",
            })
          }
        },
      },
    }),
    apiKey({
      // Admin-issued keys only (see features/api-keys/), scoped to whichever
      // resource/action grants the admin explicitly picks at creation time —
      // see lib/api-key-permissions.ts for the full menu.
      apiKeyHeaders: "x-api-key",
      requireName: true,
      defaultPrefix: "vstack_",
      defaultKeyLength: 32,
      startingCharactersConfig: {
        shouldStore: true,
        charactersLength: 12,
      },
      keyExpiration: {
        defaultExpiresIn: null,
        minExpiresIn: 1,
        maxExpiresIn: 365,
      },
      rateLimit: {
        enabled: true,
        timeWindow: 1000 * 60 * 60 * 24,
        maxRequests: 1000,
      },
      permissions: {
        // No implicit grants — every key's permissions are chosen explicitly
        // by the admin creating it (features/api-keys/actions.ts).
        defaultPermissions: {},
      },
    }),
    openAPI({
      // The unified reference at /api/reference (lib/openapi.ts) lists this
      // generated document as its "Auth API" source instead — no need for
      // Better Auth's own page at /api/auth/reference too.
      disableDefaultReference: true,
    }),
    i18n({
      translations: {
        en: locales.en,
        ar: locales.ar,
      },
      defaultLocale: "en",
      detection: ["callback", "header"],
      getLocale: (ctx) => ctx.headers?.get("x-locale") ?? null,
    }),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session

export const enabledProviders = Object.entries(
  auth.options.socialProviders ?? {}
)
  .filter(([, config]) => Boolean(config?.clientId))
  .map(([provider]) => provider)
  .filter(isSocialProvider)

const pluginIds = new Set(
  (auth.options.plugins ?? []).map((plugin) => plugin.id)
)

export const signInMethods = {
  password: auth.options.emailAndPassword?.enabled === true,
  username:
    auth.options.emailAndPassword?.enabled === true &&
    pluginIds.has("username"),
  magicLink: pluginIds.has("magic-link"),
  emailOtp: pluginIds.has("email-otp"),
}

export type SignInMethods = typeof signInMethods

const authOptions: BetterAuthOptions = auth.options

export const signUpMethods = {
  password:
    authOptions.emailAndPassword?.enabled === true &&
    authOptions.emailAndPassword.disableSignUp !== true,
  social: Object.entries(auth.options.socialProviders ?? {})
    .filter(([, config]) => Boolean(config?.clientId))
    .filter(
      ([, config]) => !("disableSignUp" in config && config.disableSignUp)
    )
    .map(([provider]) => provider)
    .filter(isSocialProvider),
}

export type SignUpMethods = typeof signUpMethods
