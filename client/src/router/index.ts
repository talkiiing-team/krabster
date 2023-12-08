import { createRouter, createWebHashHistory } from 'vue-router'

// import HomeView from '@sovok/client/views/home-view.vue'
import { AuthRequirement } from '@sovok/client/domain/auth'
import { Page } from '@sovok/client/domain/page'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      meta: {
        auth: AuthRequirement.Whatever,
      },
      children: [
        {
          path: '',
          name: Page.Home,
          redirect: {
            name: Page.Search,
          },
        },
        {
          path: 'search',
          name: Page.Search,
          component: () => import('@sovok/client/views/search-view.vue'),
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      component: () => import('@sovok/client/views/not-found-view.vue'),
    },
  ],
})

// router.beforeEach(redirectOnAuthMiddleware)

export { router }
