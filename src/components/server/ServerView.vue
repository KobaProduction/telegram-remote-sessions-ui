<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SessionList from 'components/sessions/SessionList.vue'
import type { SessionListResponse } from 'src/shared/api/trs/model'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'
import { useServerStore } from 'src/shared/api/server/serverStore'
import CreateSession from 'components/sessions/CreateSession/CreateSession.vue'

const sessions = ref<string[] | null>(null)
const error = ref<string>('')
const showErrorModal = ref(false)
const isConnected = ref(true)

const serverStore = useServerStore()

const props = defineProps<{
  api: TelegramRemoteSessionApi;
}>()

let intervalId: ReturnType<typeof setInterval>

async function fetchSessions() {
  try {
    const data: SessionListResponse = await props.api.getSessions()
    sessions.value = data.sessions
    isConnected.value = true
    showErrorModal.value = false
  } catch (e) {
    isConnected.value = false
    error.value = `Error when trying to load sessions: ${e}`
    showErrorModal.value = true
  }
}


async function checkConnection() {
  try {
    if ((await props.api.getStatus()).status) {
      isConnected.value = true
      showErrorModal.value = false
      fetchSessions()
    } else {
      new Error('Server not responding properly')
    }
  } catch (error) {
    console.log(error)
    isConnected.value = false
    showErrorModal.value = true
  }
}

async function disconnectServer() {
  showErrorModal.value = false
  serverStore.disconnectFromServer()
}


function monitorServerConnection() {
  intervalId = setInterval(() => {
    if (isConnected.value) {
      checkConnection()
    }
  }, 5000)
}

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

onMounted(() => {
  fetchSessions()
  monitorServerConnection()
})
</script>

<template>
  <div class="column">
    <CreateSession @sessionCreated="fetchSessions" :api="props.api"></CreateSession>
    <div v-if="sessions" class="col self-center">
      <SessionList :sessions="sessions" :api="props.api" />
    </div>
    <div v-else>
      <p class="text-center">{{ error }}</p>
    </div>
  </div>


  <q-dialog v-model="showErrorModal" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Сервер перестал отвечать на запросы. Проверьте сервер.</div>
      </q-card-section>

      <q-card-actions>
        <q-btn label="Проверить соединение" @click="checkConnection" color="primary" />
        <q-btn label="Отключиться от сервера" @click="disconnectServer" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>
