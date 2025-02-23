<script setup lang="ts">
import { onMounted } from 'vue'
//
// import SessionList from '@/widgets/sessions/SessionList.vue'
// import type { SessionListResponse } from '@/shared/api/trs/model'
// import type { TelegramRemoteSessionApi } from '@/shared/api/trs/telegramRemoteSessionApi'
import { useMemoryServersStore, useStaticServersStore } from '@/entities/servers'
// import type { TelegramRemoteSessionApi } from '@/shared/api/trs'
// import CreateSessionButton from '@/widgets/sessions/CreateSession/CreateSessionButton.vue'
//
// const sessions = ref<string[] | null>(null)
// const error = ref<string>('')
// const showErrorModal = ref(false)
// const selectedState = ref<number | null>(null)
// const selectedActive = ref<boolean | null>(null)
// // const serverStore = useServerStore()
// const sessionStatesSelector = [
//   { label: 'All states', value: null },
//   { label: "Not authenticated", value: 0 },
//   { label: "Authenticated", value: 1 },
//   { label: "Broken", value: 2 }
// ];
// const sessionIsActiveSelector = [
//   { label: 'All active status', value: null },
//   { label: "Active", value: true},
//   { label: "Inactive", value: false },
// ];
// const props = defineProps<{
//   api: TelegramRemoteSessionApi;
// }>()
//
// let intervalId: ReturnType<typeof setInterval>
//
// async function fetchSessions() {
//   try {
//     const data: SessionListResponse = await props.api.getSessions(selectedState.value, selectedActive.value)
//     sessions.value = data.sessions
//     isConnected.value = true
//     showErrorModal.value = false
//   } catch (e) {
//     isConnected.value = false
//     error.value = `Error when trying to load sessions: ${e}`
//     showErrorModal.value = true
//   }
// }
//
//
// async function checkConnection() {
//   try {
//     if ((await props.api.getStatus()).status) {
//       isConnected.value = true
//       showErrorModal.value = false
//       await fetchSessions()
//     } else {
//       new Error('Server not responding properly')
//     }
//   } catch (error) {
//     console.log(error)
//     isConnected.value = false
//     showErrorModal.value = true
//   }
// }
//
// async function disconnectServer() {
//   showErrorModal.value = false
//   // serverStore.disconnectFromServer()
// }
//
//
// function monitorServerConnection() {
//   intervalId = setInterval(() => {
//     if (isConnected.value) {
//       checkConnection()
//     }
//   }, 5000)
// }
//
//

const memoryStore = useMemoryServersStore()
const staticStore = useStaticServersStore()

async function loadServer() {
  if (!memoryStore.connectedServer && staticStore.lastConnectedServerUrl) {
    await memoryStore.connect(staticStore.lastConnectedServerUrl)
  }
}

onMounted(loadServer)
</script>


<template>
  <div class="text-h6">Connected to server: {{ staticStore.lastConnectedServerUrl }}</div>
<!--  <p>{{ memoryStore.connectedServerVersion }}</p>-->

<!--      <div v-else class="full-width">-->
  <!--      <q-card-section>-->
  <!--        <h5 class="text-center">⚠️Server not selected</h5>-->
  <div class="column">
    <!--    <CreateSessionButton @sessionCreated="fetchSessions" :api="props.api"></CreateSessionButton>-->
<!--        <q-select-->
<!--          v-model="selectedActive"-->
<!--          :options="sessionIsActiveSelector"-->
<!--          label="Session activity filter"-->
<!--          outlined-->
<!--          emit-value-->
<!--          map-options-->
<!--          class="q-mb-sm"-->
<!--          @update:model-value="fetchSessions"-->
<!--        />-->
    <!--    <q-select-->
    <!--      v-model="selectedState"-->
    <!--      :options="sessionStatesSelector"-->
    <!--      label="Session state filter"-->
    <!--      outlined-->
    <!--      emit-value-->
    <!--      map-options-->
    <!--      @update:model-value="fetchSessions"-->
    <!--    />-->
    <!--    <div v-if="sessions" class="col self-center">-->
    <!--      <SessionList :sessions="sessions" :api="props.api" />-->
    <!--    </div>-->
    <!--    <div v-else>-->
    <!--      <p class="text-center">{{ error }}</p>-->
    <!--    </div>-->
    <!--  </div>-->

    <!--  <q-dialog v-model="showErrorModal" persistent>-->
    <!--    <q-card>-->
    <!--      <q-card-section>-->
    <!--        <div class="text-h6">Сервер перестал отвечать на запросы. Проверьте сервер.</div>-->
    <!--      </q-card-section>-->

    <!--      <q-card-actions>-->
    <!--        <q-btn label="Проверить соединение" @click="checkConnection" color="primary" />-->
    <!--        <q-btn label="Отключиться от сервера" @click="disconnectServer" color="negative" />-->
    <!--      </q-card-actions>-->
    <!--    </q-card>-->
    <!--  </q-dialog>-->
  </div>
</template>
