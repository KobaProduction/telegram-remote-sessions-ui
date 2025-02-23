<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServerStore } from 'src/shared/api/server/serverStore'
import { Notify } from 'quasar'
import { AxiosError } from 'axios'

const serverStatuses = ref<Map<string, boolean>>(new Map())
const newServerName = ref<string>('')
const newServerURL = ref<string>('')
const editingIndex = ref<string | null>(null)
const editedServerName = ref<string>('')
const editedServerURL = ref<string>('')
const editedServerNameError = ref<string>('')
const editedServerUrlError = ref<string>('')
const updateServerErrorMessage = ref<string>('Server is not available')
const addServerErrorMessage = ref<string>('')
const addServerUrlErrorMessage = ref<string>('')

const itemsPerPage = 5
const currentPage = ref(1)
const isExpanded = ref(false)
const serverStore = useServerStore()

const updateServerStatuses = async () => {
  const statuses = new Map<string, boolean>()
  for (const [serverName, serverUrl] of Object.entries(serverStore.serverHistory)) {
    try {
      const api = serverStore.createApiInstance(serverUrl)
      const status = await api.getStatus()
      statuses.set(serverName, status.status === 'ok')
    } catch (error) {
      if (error instanceof AxiosError) {
        statuses.set(serverName, false)
      }
    }
  }

  serverStatuses.value = statuses
}

const getStatusIcon = (serverName: string) => {
  return serverStatuses.value.get(serverName) ? 'check_circle' : 'cancel'
}

const addServer = async () => {
  if (!newServerURL.value.trim() || !newServerName.value.trim()) return

  const serverUrl = newServerURL.value.trim()
  const serverName = newServerName.value.trim()

  if (Object.values(serverStore.serverHistory).includes(serverUrl)) {
    addServerUrlErrorMessage.value = 'Server with such URL already exists'
    return
  }
  if (serverStore.serverHistory[serverName]) {
    addServerErrorMessage.value = 'Server with such name already exists'
    return
  }
  const api = serverStore.createApiInstance(serverUrl)
  addServerErrorMessage.value = ''
  try {
    const status = await api.getStatus()

    if (status.status === 'ok') {
      serverStore.serverHistory[serverName] = serverUrl
      serverStore.saveServerHistory()
      newServerURL.value = ''
      newServerName.value = ''
      await updateServerStatuses()
      Notify.create({
        message: 'The server is successfully added!',
        color: 'green',
        position: 'bottom',
        timeout: 1000,
        progress: true
      })
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e?.message) {
        addServerUrlErrorMessage.value = e.message
      }
    }
  }
}

const removeServer = (serverName: string) => {
  const removedServerUrl = serverStore.serverHistory[serverName]
  delete serverStore.serverHistory[serverName]
  serverStore.saveServerHistory()
  updateServerStatuses()
  Notify.create({
    message: `The server is successfully removed! URL: ${removedServerUrl}`,
    color: 'red',
    position: 'bottom',
    timeout: 1000,
    progress: true
  })
}

const editServer = (serverName: string) => {
  const originalServerUrl = serverStore.serverHistory[serverName] || ''
  editingIndex.value = serverName
  editedServerName.value = serverName
  editedServerURL.value = originalServerUrl
}

const saveEdit = async () => {
  if (!editedServerURL.value.trim() || !editedServerName.value.trim()) return

  const newServerUrl = editedServerURL.value.trim()
  const newServerName = editedServerName.value.trim()
  if (newServerName !== editingIndex.value && serverStore.serverHistory[newServerName]) {
    editedServerNameError.value = 'Server with this name already exists'
    return
  }
  try {
    const api = serverStore.createApiInstance(newServerUrl)
    const status = await api.getStatus()

    if (status.status === 'ok') {
      if (editingIndex.value !== newServerName) {
        delete serverStore.serverHistory[editingIndex.value!]
      }
      serverStore.serverHistory[newServerName] = newServerUrl
      serverStore.saveServerHistory()
      await updateServerStatuses()
      editingIndex.value = null
      Notify.create({
        message: 'Server updated successfully!',
        color: 'green',
        position: 'bottom',
        timeout: 1000,
        progress: true
      })
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.message) {
        editedServerUrlError.value = error.message
      }
    }
  }
}

function clearLocalStorage() {
  localStorage.clear()
}

const maxPages = computed(() => Math.ceil(Object.keys(serverStore.serverHistory).length / itemsPerPage))

const paginatedServers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return Object.entries(serverStore.serverHistory).slice(start, end)
})

onMounted(() => {
  updateServerStatuses()
  setInterval(updateServerStatuses, 1000)
})
</script>

<template>
  <q-btn
    @click="clearLocalStorage()"
    label="Clear all saved data"
    color="secondary"
    class="absolute-top"
  ></q-btn>
  <q-card class="q-pa-md" style="min-width: 200px; max-width: 450px; width: 30vw;">
    <q-banner v-if="serverStore.isConnected" class="q-mb-md">
      <div class="text-h6">Connected to server: {{ serverStore.lastConnectedServerUrl }}</div>
      <q-btn
        color="negative"
        label="Disconnect"
        @click="serverStore.disconnectFromServer()"
        class="q-mt-sm"
        size="sm"
      />
    </q-banner>
    <q-expansion-item
      v-model="isExpanded"
      icon="list"
      label="List of servers"
      class="full-width"
    >
      <q-card-section class="q-gutter-y-md">
        <q-input
          v-model="newServerName"
          label="Name"
          outlined
          dense
          :error="!!addServerErrorMessage"
          :error-message="addServerErrorMessage"
        />
        <q-input
          v-model="newServerURL"
          label="IP address"
          outlined
          dense
          :error="!!addServerUrlErrorMessage"
          :error-message="addServerUrlErrorMessage"
        />
        <q-btn
          color="primary"
          label="Add server"
          @click="addServer"
          class="full-width"
          size="sm"
          :disabled="!newServerURL || !newServerName"
        />
      </q-card-section>

      <q-card-section v-if="Object.keys(serverStore.serverHistory).length === 0" class="text-center">
        <div class="text-grey">The list of servers is empty</div>
      </q-card-section>

      <q-list v-else bordered class="full-width">
        <q-item
          v-for="([serverName, serverUrl]) in paginatedServers"
          :key="serverName"
          clickable
          class="q-pa-sm"
        >
          <q-item-section class="col">
            <div class="row items-center">
              <q-icon
                :name="getStatusIcon(serverName)"
                class="q-mr-sm"
                size="sm"
                :color="serverStatuses.get(serverName) ? 'positive' : 'negative'"
              />
              <div v-if="editingIndex === serverName" class="col q-gutter-y-sm">
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
                  <div class="text-bold text-body1">{{ serverName }}</div>
                  <a
                    :href="serverUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-caption text-grey-7 text-underline"
                  >
                    {{ serverUrl }}
                  </a>
                </div>
              </q-item-label>
            </div>
          </q-item-section>

          <q-item-section side class="q-gutter-xs">
            <p v-if="!serverStatuses.get(serverName)" class="text-red text-caption q-mb-none">
              {{ updateServerErrorMessage }}
            </p>
            <q-btn
              color="secondary"
              label="Connect"
              @click="serverStore.connectToServer(serverUrl)"
              size="sm"
              :disable="!serverStatuses.get(serverName)"
              class="full-width"
            />
          </q-item-section>

          <q-item-section side class="q-gutter-xs">
            <q-btn
              v-if="editingIndex === serverName"
              color="positive"
              icon="check"
              @click="saveEdit"
              size="sm"
            />
            <q-btn
              v-else
              color="warning"
              icon="edit"
              @click="editServer(serverName)"
              :disable="!serverStatuses.get(serverName)"
              size="sm"
            />
            <q-btn
              color="negative"
              icon="delete"
              @click="removeServer(serverName)"
              size="sm"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-pagination
        v-if="Object.keys(serverStore.serverHistory).length > itemsPerPage"
        v-model="currentPage"
        :max="maxPages"
        boundary-links
        class="q-mt-md"
        input-class="text-primary"
      />
    </q-expansion-item>
  </q-card>
</template>
