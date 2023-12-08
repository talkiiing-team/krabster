import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { MainRouter } from '@sovok/server'
import { AUTH_TOKEN_KEY } from './domain/auth'

export const trpc = createTRPCProxyClient<MainRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)

        if (token)
          return {
            Authorization: `Bearer ${token}`,
          }

        return {}
      },
    }),
  ],
})
