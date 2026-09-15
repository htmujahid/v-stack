export const MAX_AVATAR_BYTES = 5 * 1024 * 1024

export const avatarExtensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const acceptedAvatarTypes = Object.keys(avatarExtensionByType)
