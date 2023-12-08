import { createApp } from 'vue'
import App from './app.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
// import { viewTransitionsDirectivePlugin } from './composables/transitions'

const app = createApp(App).use(router).use(createPinia()).use(createHead())
//   .use(viewTransitionsDirectivePlugin)

router.isReady().then(() => {
  app.mount('#app')
})
