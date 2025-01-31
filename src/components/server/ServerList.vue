<script setup lang="ts">
import ServerView from 'components/server/ServerView.vue'
import { onMounted, ref } from 'vue'
import { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'
import ConnectForm from 'components/server/ConnectForm.vue'
import { useServerStore } from 'src/shared/api/server/serverStore'

let api = new TelegramRemoteSessionApi()
const selectedServerApi = ref<TelegramRemoteSessionApi | null>(null)
const isConnected = ref(false)
const serverStore = useServerStore()


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


onMounted(loadServer)
</script>

<template>
  <div v-if="serverStore.isConnected && serverStore.selectedServerApi">
    <ServerView :api="api" />

  </div>
  <div v-else>
    <p>⚠️ Server not selected</p>
    <ConnectForm @onConnect="serverStore.connectToServer" />
  </div>
</template>

<style></style>
