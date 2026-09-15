import { authenticationIcons } from "@/components/authentication-icons"

export const socialProviders = {
  apple: { name: "Apple", icon: authenticationIcons.authenticationApple },
  atlassian: {
    name: "Atlassian",
    icon: authenticationIcons.authenticationAtlassian,
  },
  dropbox: { name: "Dropbox", icon: authenticationIcons.authenticationDropbox },
  facebook: {
    name: "Facebook",
    icon: authenticationIcons.authenticationFacebook,
  },
  figma: { name: "Figma", icon: authenticationIcons.authenticationFigma },
  github: { name: "GitHub", icon: authenticationIcons.authenticationGitHub },
  gitlab: { name: "GitLab", icon: authenticationIcons.authenticationGitLab },
  google: { name: "Google", icon: authenticationIcons.authenticationGoogle },
  huggingface: {
    name: "Hugging Face",
    icon: authenticationIcons.authenticationHuggingFace,
  },
  kakao: { name: "Kakao", icon: authenticationIcons.authenticationKakao },
  kick: { name: "Kick", icon: authenticationIcons.authenticationKick },
  line: { name: "LINE", icon: authenticationIcons.authenticationLine },
  linear: { name: "Linear", icon: authenticationIcons.authenticationLinear },
  linkedin: {
    name: "LinkedIn",
    icon: authenticationIcons.authenticationLinkedIn,
  },
  microsoft: {
    name: "Microsoft",
    icon: authenticationIcons.authenticationMicrosoft,
  },
  naver: { name: "Naver", icon: authenticationIcons.authenticationNaver },
  notion: { name: "Notion", icon: authenticationIcons.authenticationNotion },
  paypal: { name: "PayPal", icon: authenticationIcons.authenticationPayPal },
  reddit: { name: "Reddit", icon: authenticationIcons.authenticationReddit },
  roblox: { name: "Roblox", icon: authenticationIcons.authenticationRoblox },
  salesforce: {
    name: "Salesforce",
    icon: authenticationIcons.authenticationSalesforce,
  },
  slack: { name: "Slack", icon: authenticationIcons.authenticationSlack },
  spotify: { name: "Spotify", icon: authenticationIcons.authenticationSpotify },
  tiktok: { name: "TikTok", icon: authenticationIcons.authenticationTikTok },
  twitch: { name: "Twitch", icon: authenticationIcons.authenticationTwitch },
  twitter: { name: "X", icon: authenticationIcons.authenticationTwitter },
  vk: { name: "VK", icon: authenticationIcons.authenticationVK },
  zoom: { name: "Zoom", icon: authenticationIcons.authenticationZoom },
} satisfies Record<string, { name: string; icon: React.ComponentType }>

export type SocialProvider = keyof typeof socialProviders

export function isSocialProvider(value: string): value is SocialProvider {
  return value in socialProviders
}
