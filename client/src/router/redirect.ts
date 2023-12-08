// import { NavigationGuard } from 'vue-router'

// import {
//   AUTH_TOKEN_KEY,
//   RedirectDecision,
//   shouldRedirect,
// } from '@sovok/client/domain/auth'
// import { Page } from '@sovok/client/domain/page'
// import { exists } from '@sovok/shared/guards'

// export const redirectOnAuthMiddleware: NavigationGuard = (to, _from, next) => {
//   const accessToken = localStorage.getItem(AUTH_TOKEN_KEY)
//   const isAuthorized = exists(accessToken)

//   const requirement = to.meta.auth ?? undefined
//   const decision = shouldRedirect(isAuthorized, requirement)

//   switch (decision) {
//     case RedirectDecision.ToAuth: {
//       return next({
//         name: Page.SignIn,
//       })
//     }

//     case RedirectDecision.ToIndex: {
//       return next({
//         name: Page.DashboardHome,
//       })
//     }
//   }

//   return next()
// }
