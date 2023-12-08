import { Resolver } from 'awilix'

export type Injection<Name extends string, Type> = {
  [key in Name]: Type
}

export type ValueOf<In extends Injection<any, any>> = In[keyof In]

export type StrictNameAndRegistrationPair<T> = {
  [U in keyof T]: Resolver<T[U]>
}
