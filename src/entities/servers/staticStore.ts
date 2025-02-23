import { defineStore } from 'pinia'

interface ServersStaticStoreData {
  lastConnectedServerUrl: string
}

export const useStaticServersStore = defineStore('serversStaticStore', {
  state: () => (<ServersStaticStoreData> {
    lastConnectedServerUrl: ""
  }),
  actions: {
    setLastConnectedServerUrl(url: string) {
      this.lastConnectedServerUrl = url
    }
  },
  persist: {
    debug: true,
    storage: localStorage
  }
})
