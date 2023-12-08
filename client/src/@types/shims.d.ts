import 'vue-router'
import { AuthRequirement } from '@sovok/client/domain/auth'

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthRequirement
  }
}
