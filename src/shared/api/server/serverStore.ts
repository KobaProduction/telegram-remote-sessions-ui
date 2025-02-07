import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'

const STORAGE_KEY = 'lastConnectedServerUrl'

export const useServerStore = defineStore('server', () => {
  const isConnected = ref(false)
  const selectedServerApi = ref<TelegramRemoteSessionApi | null>(null)
  const lastConnectedServerUrl = ref(localStorage.getItem(STORAGE_KEY) || '')

  async function connectToServer(serverUrl: string, rememberServer: boolean = false) {
    try {
      const api = createApiInstance(serverUrl)
      const status = await api.getStatus()

      if (!status.status) {
        return
      }
      console.log('✅ Successful connection to the server!:', serverUrl)
      if (rememberServer) {
        const storedServers = JSON.parse(localStorage.getItem('server_history') || '[]')
        if (!storedServers.includes(serverUrl)) {
          storedServers.push(serverUrl)
          localStorage.setItem('server_history', JSON.stringify(storedServers))
          console.log('Сервер был добавлен') //todo: update server_history in real time
        }
      }

      localStorage.setItem(STORAGE_KEY, serverUrl)
      selectedServerApi.value = api
      isConnected.value = true
      return api
    } catch (error) {
      throw error instanceof Error ? error : new Error('Неизвестная ошибка')
    }
  }
  const createApiInstance = (serverUrl: string): TelegramRemoteSessionApi => {
    let url = serverUrl
    if (!/^https?:\/\//.test(url)) {
      url = `http://${url}`
    }
    return new TelegramRemoteSessionApi(url)
  }
  function disconnectFromServer() {
    console.log('🔌 Disconnecting from the server')
    localStorage.removeItem(STORAGE_KEY)
    selectedServerApi.value = null
    isConnected.value = false
  }

  async function restoreConnection() {
    if (lastConnectedServerUrl.value) {
      console.log('🔄 Restoring connection to the server:', lastConnectedServerUrl.value)
      await connectToServer(lastConnectedServerUrl.value)
    }
  }

  restoreConnection().then()
  const api = computed(() => selectedServerApi.value instanceof TelegramRemoteSessionApi ? selectedServerApi.value : null)

  return { isConnected, selectedServerApi, lastConnectedServerUrl, connectToServer, disconnectFromServer, api, createApiInstance}
})
