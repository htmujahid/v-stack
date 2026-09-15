type SafeActionLikeResult = {
  serverError?: string
  validationErrors?: {
    formErrors: string[]
    fieldErrors: Record<string, string[] | undefined>
  }
}

/**
 * Reduces a next-safe-action result to a single string for a toast, or
 * `null` when the mutation actually succeeded. Client components never need
 * to know whether a failure was a thrown domain error (`serverError`) or a
 * schema mismatch (`validationErrors`) — both render the same way.
 */
export function getActionError(result: SafeActionLikeResult): string | null {
  if (result.serverError) {
    return result.serverError
  }

  if (result.validationErrors) {
    const { formErrors, fieldErrors } = result.validationErrors
    return (
      formErrors[0] ??
      Object.values(fieldErrors).flatMap((errors) => errors ?? [])[0] ??
      "Invalid input."
    )
  }

  return null
}
