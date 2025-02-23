import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()
  pinia.use(
    createPersistedState({
      key: (id) => `__persisted__${id}`,
    }),
  )

  return pinia
})
