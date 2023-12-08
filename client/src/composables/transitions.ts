import { exists } from '@sovok/shared'
import { onErrorCaptured, type Plugin } from 'vue'
import { useRouter } from 'vue-router'

export const enablePageTransitions = () => {
  if (!exists(document.startViewTransition)) {
    return
  }

  const router = useRouter()

  let finishTransition: undefined | (() => void)
  let abortTransition: undefined | (() => void)

  router.beforeResolve(to => {
    if (to.meta.pageTransition === false) {
      return
    }

    const promise = new Promise<void>((resolve, reject) => {
      finishTransition = resolve
      abortTransition = reject
    })

    let changeRoute: () => void
    const ready = new Promise<void>(resolve => (changeRoute = resolve))

    const transition = document.startViewTransition!(() => {
      changeRoute()
      return promise
    })

    transition.finished.then(() => {
      abortTransition = undefined
      finishTransition = undefined
    })

    return ready
  })

  router.afterEach(() => {
    finishTransition?.()
    finishTransition = undefined
  })

  onErrorCaptured(() => {
    abortTransition?.()
    abortTransition = undefined
    return false
  })
}

export const viewTransitionsDirectivePlugin: Plugin = {
  install(vue) {
    vue.directive('view-name', {
      mounted(el: HTMLElement, binding) {
        el.style.viewTransitionName = binding.value
      },
    })
  },
}
