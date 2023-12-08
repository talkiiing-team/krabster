interface ViewTransition {
  finished: Promise<void>
}

declare interface Document {
  startViewTransition(callback: () => void): ViewTransition
}

declare interface CSSStyleDeclaration {
  viewTransitionName: string
}
