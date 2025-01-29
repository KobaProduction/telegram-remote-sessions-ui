<script setup lang="ts">
import ServerView from 'components/server/ServerView.vue'
import { onMounted, ref } from 'vue'
import { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'
import ConnectForm from 'components/server/ConnectForm.vue'

let api = new TelegramRemoteSessionApi()
const selectedServerApi = ref<TelegramRemoteSessionApi | null>(null)
const isConnected = ref(false)



async function loadServer() {
  const lastConnectedServerUrl = localStorage.getItem('lastConnectedServerUrl')
  if (!lastConnectedServerUrl) return

  api = new TelegramRemoteSessionApi(lastConnectedServerUrl)

  const status = await api.getStatus()
  if (status.status) {
    selectedServerApi.value = api
    isConnected.value = true
    return selectedServerApi
  } else {
    localStorage.removeItem('lastConnectedServerUrl')
    isConnected.value = false
  }
}

async function connectToServer(serverUrl: string) {
  try {
    api = new TelegramRemoteSessionApi(serverUrl)
  } catch (e) {
    return console.error(e)
  }

  const status = await api.getStatus()

  if (!status.status) return console.log("Failed to connect to server")
  localStorage.setItem('lastConnectedServerUrl', serverUrl)
  isConnected.value = true
}

onMounted(loadServer)
</script>

<template>
  <div v-if="isConnected">
    <ServerView :api="api" />
  </div>
  <div v-else>
    <p>Server not selected</p>
    <ConnectForm @onConnect="connectToServer" />
  </div>
</template>

<style scoped></style>
