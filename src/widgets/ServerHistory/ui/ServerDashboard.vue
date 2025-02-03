<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServerStore } from 'src/shared/api/server/serverStore'
import { TelegramRemoteSessionApi } from 'src/shared/api/trs'

const STORAGE_KEY = 'server_history'
const serversList = ref<string[]>([])
const serverStatuses = ref<Map<string, boolean>>(new Map())
const newServer = ref<string | null>('')
const editingIndex = ref<number | null>(null)
const editedServer = ref<string>('')

const itemsPerPage = 5
const currentPage = ref(1)
const isExpanded = ref(false)
const serverStore = useServerStore()


const createApiInstance = (serverUrl: string): TelegramRemoteSessionApi => {
  let url = serverUrl
  if (!/^https?:\/\//.test(url)) {
    url = `http://${url}`
  }
  return new TelegramRemoteSessionApi(url)
}

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serversList.value))
}

const addServer = async () => {
  if (!newServer.value?.trim()) return

  const server = newServer.value.trim()
  if (serversList.value.includes(server)) return

  try {
    const api = createApiInstance(server)
    const status = await api.getStatus()

    if (status.status === 'ok') {
      serversList.value.push(server)
      saveToStorage()
      newServer.value = null
      updateServerStatuses()
    }
  } catch (error) {
    console.error('Ошибка при проверке сервера:', error)
  }
}

const removeServer = (index: number) => {
  serversList.value.splice(index, 1)
  saveToStorage()
  updateServerStatuses()
}

const editServer = async (index: number) => {
  const originalServer = serversList.value[index]
  editingIndex.value = index
  editedServer.value = originalServer ?? ''
}

const saveEdit = async (index: number) => {
  if (!editedServer.value.trim()) return

  const newServerUrl = editedServer.value.trim()

  try {
    const api = createApiInstance(newServerUrl)
    const status = await api.getStatus()

    if (status.status === 'ok') {
      serversList.value[index] = newServerUrl
      saveToStorage()
      await updateServerStatuses()
    }
  } catch (error) {
    console.error('Ошибка при проверке сервера:', error)
  }

  editingIndex.value = null
}

const maxPages = computed(() => Math.ceil(serversList.value.length / itemsPerPage))

const paginatedServers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return serversList.value.slice(start, end)
})

const updateServerStatuses = async () => {
  const statuses = new Map<string, boolean>()
  for (const server of serversList.value) {
    try {
      const api = createApiInstance(server)
      const status = await api.getStatus()
      statuses.set(server, status.status === 'ok')
    } catch (error) {
      statuses.set(server, false)
      console.log('При обновлении статуса сервера:', server, 'произошла ошибка:', error)
    }
  }

  serverStatuses.value = statuses
}

const getStatusIcon = (server: string) => {
  return serverStatuses.value.get(server) ? 'check_circle' : 'cancel'
}

onMounted(() => {
  serversList.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  updateServerStatuses()
  setInterval(updateServerStatuses, 5000)
})
</script>

<template>

  <q-card class="q-pa-md" style="min-width: 450px; max-width: 450px">
    <q-banner v-if="serverStore.isConnected" class="q-mb-md">
      <div class="text-h6">Connected to server: {{ serverStore.lastConnectedServerUrl }}</div>
      <q-btn
        color="negative"
        label="Отключиться"
        @click="serverStore.disconnectFromServer()"
        class="q-mt-sm"
        size="sm"
      />
    </q-banner>
    <q-expansion-item
      v-model="isExpanded"
      icon="list"
      label="Список серверов"
    >
      <q-card-section>
        <q-input v-model="newServer" label="Добавить сервер" outlined dense />
        <q-btn
          color="primary"
          label="Добавить"
          @click="addServer"
          class="q-mt-sm"
          size="sm"
        />
      </q-card-section>

      <q-card-section v-if="serversList.length === 0" class="text-center">
        <div class="text-grey">Список серверов пуст</div>
      </q-card-section>

      <q-list v-else bordered>
        <q-item
          v-for="(server, index) in paginatedServers"
          :key="server"
          clickable
        >
          <q-item-section>
            <div style="display: flex; align-items: center;">
              <q-icon
                :name="getStatusIcon(server)"
                class="q-mr-sm"
                style="flex-shrink: 0;"
                :color="serverStatuses.get(server) ? 'positive' : 'negative'"
              />
              <q-input
                v-if="editingIndex === index"
                v-model="editedServer"
                dense
                autofocus
                @keyup.enter="saveEdit(index)"
                style="flex-grow: 1;"
              />
              <q-item-label v-else style="flex-grow: 1;">{{ server }}</q-item-label>
            </div>
          </q-item-section>
          <q-item-section side>
            <q-btn
              color="secondary"
              label="Подключиться"
              @click="serverStore.connectToServer(server)"
              size="sm"
              class="q-ml-sm"
              :disable="!serverStatuses.get(server)"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="editingIndex === index"
              color="positive"
              icon="check"
              @click="saveEdit(index)"
              size="sm"
            />
            <q-btn
              v-else
              color="warning"
              icon="edit"
              @click="editServer(index)"
              size="sm"
            />
            <q-btn
              color="negative"
              icon="delete"
              @click="removeServer(index)"
              class="q-ml-sm"
              size="sm"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <q-pagination
        v-if="serversList.length > itemsPerPage"
        v-model="currentPage"
        :max="maxPages"
        boundary-links
        class="q-mt-md flex align-center"
      />
    </q-expansion-item>
  </q-card>
</template>
