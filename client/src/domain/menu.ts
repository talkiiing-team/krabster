import { RouteLocation } from 'vue-router'

export type MenuItem = {
  title: string
  to?: RouteLocation
  action?: CallableFunction
}

export type MenuGroup = MenuItem[]

export type Menu =
  | MenuGroup[]
  | {
      groups: MenuGroup[]
      title?: string
    }
