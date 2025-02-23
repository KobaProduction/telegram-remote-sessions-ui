import { defineStore } from 'pinia'
// import { computed, ref } from 'vue'
// import { TelegramRemoteSessionApi } from '@/shared/api/trs/telegramRemoteSessionApi'
// import { Notify } from 'quasar'
import { TelegramRemoteSessionApi } from '@/shared/api/trs'
//
// const STORAGE_KEY = 'lastConnectedServerUrl'
// const HISTORY_STORAGE_KEY = 'server_history'





// const isConnected = ref(false)
// const selectedServerApi = ref<TelegramRemoteSessionApi | null>(null)
// const lastConnectedServerUrl = ref(localStorage.getItem(STORAGE_KEY) || '')
// const serverHistory = ref<Record<string, string>>(JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '{}'))
//
// const saveServerHistory = () => {
//   localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(serverHistory.value))
// }
//
// async function connectToServer(serverUrl: string, rememberServer: boolean = false) {
//   try {
//     const api = createApiInstance(serverUrl)
//     const status = await api.getStatus()
//
//     if (!status.status) {
//       return
//     }
//     Notify.create({
//       message: `✅ Successful connection to the server!: ${serverUrl}`,
//       timeout: 1000,
//       progress: true
//     })
//     if (rememberServer && !Object.values(serverHistory.value).includes(serverUrl)) {
//       const serverName = Object.keys(serverHistory.value).find(
//         key => serverHistory.value[key] === serverUrl) || `Server ${Object.keys(serverHistory.value).length + 1}`
//       serverHistory.value[serverName] = serverUrl
//       saveServerHistory()
//     }
//
//     localStorage.setItem(STORAGE_KEY, serverUrl)
//     selectedServerApi.value = api
//     isConnected.value = true
//     return api
//   } catch (error) {
//     throw error instanceof Error ? error : new Error('Неизвестная ошибка')
//   }
// }
//
// const createApiInstance = (serverUrl: string): TelegramRemoteSessionApi => {
//   let url = serverUrl
//   if (!/^https?:\/\//.test(url)) {
//     url = `http://${url}`
//   }
//   return new TelegramRemoteSessionApi(url)
// }
//
// function disconnectFromServer() {
//   Notify.create({
//     message: 'Disconnected from the server!',
//     color: 'red',
//     position: 'bottom',
//     timeout: 1000,
//     progress: true
//   })
//   localStorage.removeItem(STORAGE_KEY)
//   selectedServerApi.value = null
//   isConnected.value = false
// }
//
// async function restoreConnection() {
//   if (lastConnectedServerUrl.value) {
//     console.log('🔄 Restoring connection to the server:', lastConnectedServerUrl.value)
//     await connectToServer(lastConnectedServerUrl.value)
//   }
// }
//
// restoreConnection().then()
// const api = computed(() => selectedServerApi.value instanceof TelegramRemoteSessionApi ? selectedServerApi.value : null)



export const useMemoryServersStore = defineStore('serversMemoryStore', {
  state: () => ({
    connectedServerApi: <TelegramRemoteSessionApi | undefined> undefined,
    connectedServerVersion: <string | undefined> undefined,
  }),
  actions: {

    async connect(url: string) {
      const urlObj = new URL(url)
      const api = new TelegramRemoteSessionApi(urlObj.href)
      const res = await api.getStatus()
      if (!res.status) return this.disconnect()
      this.connectedServerVersion = res.version
      this.connectedServerApi = api
    },

    disconnect() {
      this.connectedServerVersion = undefined
      this.connectedServerApi = undefined
    }
  },
  persist: {
    debug: true,
  }
})
