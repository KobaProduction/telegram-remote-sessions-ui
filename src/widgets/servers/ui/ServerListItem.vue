<script setup lang="ts">
import { ref } from 'vue'
// import { Notify } from 'quasar'
// import { AxiosError } from 'axios'
// import { useServerStore } from '@/entities/servers'
import type { ServerStatuses } from '@/widgets/servers/types/props'

interface ServerListProps {
  serverName: string
  serverUrl: string
  serverStatus: boolean,
  onConnectClick: () => void
}

// const serverStore = useServerStore()

const serverStatuses = ref<ServerStatuses>(new Map())

const updateServerErrorMessage = ref<string>('Server is not available')

const props = defineProps<ServerListProps>()

const editingIndex = ref<string | null>(null)
const editedServerName = ref<string>('')
const editedServerURL = ref<string>('')
const editedServerNameError = ref<string>('')
const editedServerUrlError = ref<string>('')


// const saveEdit = async () => {
//   if (!editedServerURL.value.trim() || !editedServerName.value.trim()) return
//
//   const newServerUrl = editedServerURL.value.trim()
//   const newServerName = editedServerName.value.trim()
//   if (newServerName !== editingIndex.value && serverStore.serverHistory[newServerName]) {
//     editedServerNameError.value = 'Server with this name already exists'
//     return
//   }
//   try {
//     const api = serverStore.createApiInstance(newServerUrl)
//     const status = await api.getStatus()
//
//     if (status.status === 'ok') {
//       if (editingIndex.value !== newServerName) {
//         delete serverStore.serverHistory[editingIndex.value!]
//       }
//       serverStore.serverHistory[newServerName] = newServerUrl
//       serverStore.saveServerHistory()
//       await updateServerStatuses()
//       editingIndex.value = null
//       Notify.create({
//         message: 'Server updated successfully!',
//         color: 'green',
//         position: 'bottom',
//         timeout: 1000,
//         progress: true
//       })
//     }
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       if (error?.message) {
//         editedServerUrlError.value = error.message
//       }
//     }
//   }
// }
//
// const updateServerStatuses = async () => {
//   for (const [serverName, serverUrl] of Object.entries(serverStore.serverHistory)) {
//     try {
//       const api = serverStore.createApiInstance(serverUrl)
//       const status = await api.getStatus()
//       statuses.set(serverName, status.status === 'ok')
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         statuses.set(serverName, false)
//       }
//     }
//   }
//
//   serverStatuses.value = statuses
// }
//
// const removeServer = (serverName: string) => {
//   const removedServerUrl = serverStore.serverHistory[serverName]
//   delete serverStore.serverHistory[serverName]
//   serverStore.saveServerHistory()
//   updateServerStatuses()
//   Notify.create({
//     message: `The server is successfully removed! URL: ${removedServerUrl}`,
//     color: 'red',
//     position: 'bottom',
//     timeout: 1000,
//     progress: true
//   })
// }
//
//
//
//
// const editServer = (serverName: string) => {
//   const originalServerUrl = serverStore.serverHistory[serverName] || ''
//   editingIndex.value = serverName
//   editedServerName.value = serverName
//   editedServerURL.value = originalServerUrl
// }
//
// const getStatusIcon = (serverName: string) => {
//   return serverStatuses.value.get(serverName) ? 'check_circle' : 'cancel'
// }
//
// onMounted(() => {
//   updateServerStatuses()
//   setInterval(updateServerStatuses, 1000)
// })
</script>

<template>
  <q-item-section class="col">
    <div class="row items-center">
      <q-icon
        name="getStatusIcon(props.serverName)"
        class="q-mr-sm"
        size="sm"
        :color="serverStatuses.get(props.serverName) ? 'positive' : 'negative'"
      />
      <div v-if="true" class="col q-gutter-y-sm">
        sdfsfd
      </div>
      <div v-if="editingIndex === props.serverName" class="col q-gutter-y-sm">
        <q-input
          v-model="editedServerName"
          dense
          autofocus
          label="Name"
          :error="!!editedServerNameError"
          :error-message="editedServerNameError"
          class="col"
        />
        <q-input
          v-model="editedServerURL"
          dense
          label="URL"
          :error="!!editedServerUrlError"
          :error-message="editedServerUrlError"
          class="col"
        />
      </div>
      <q-item-label v-else class="col">
        <div class="column">
          <div class="text-bold text-body1">{{ props.serverName }}</div>
          <a
            :href="props.serverUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-caption text-grey-7 text-underline"
          >
            {{ props.serverUrl }}
          </a>
          <p v-if="!serverStatuses.get(props.serverName)" class="text-red text-caption q-mb-none">
            {{ updateServerErrorMessage }}
          </p>
        </div>
      </q-item-label>
    </div>

    <q-item-section side class="q-gutter-xs">
      <q-btn
        color="secondary"
        label="Connect"
        @click="props.onConnectClick()"
        size="sm"
        :disable="!serverStatuses.get(props.serverName)"
        class="full-width"
      />
    </q-item-section>

    <q-item-section side class="q-gutter-xs">
      <q-btn
        v-if="editingIndex === props.serverName"
        color="positive"
        icon="check"
        click="saveEdit"
        size="sm"
      />
      <q-btn
        v-else
        color="warning"
        icon="edit"
        click="editServer(props.serverName)"
        :disable="!serverStatuses.get(props.serverName)"
        size="sm"
      />
      <q-btn color="negative" icon="delete" click="removeServer(props.serverName)" size="sm" />
    </q-item-section>
  </q-item-section>
</template>
