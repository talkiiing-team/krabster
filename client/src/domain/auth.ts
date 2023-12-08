export enum AuthRequirement {
  Authenticated = 'Authenticated',
  Unauthenticated = 'Unauthenticated',
  Whatever = 'Whatever',
}

export const AUTH_TOKEN_KEY = 'sovok-auth-token'

export enum RedirectDecision {
  ToIndex,
  ToAuth,
  None,
}

export const DEFAULT_PAGE_AUTH_REQUIREMENT = AuthRequirement.Authenticated

export const shouldRedirect = (
  isAuthorized: boolean,
  requirement = DEFAULT_PAGE_AUTH_REQUIREMENT,
) => {
  switch (requirement) {
    case AuthRequirement.Authenticated: {
      if (!isAuthorized) {
        return RedirectDecision.ToAuth
      }
      break
    }

    case AuthRequirement.Unauthenticated: {
      if (isAuthorized) {
        return RedirectDecision.ToIndex
      }
      break
    }
  }

  return RedirectDecision.None
}
