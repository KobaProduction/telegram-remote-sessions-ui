<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServerStore } from 'src/shared/api/server/serverStore'
import { Notify } from 'quasar'
import { AxiosError } from 'axios'

const serverStatuses = ref<Map<string, boolean>>(new Map())
const newServerURL = ref<string | null>('')
const editingIndex = ref<number | null>(null)
const editedServer = ref<string>('')
const updateServerErrorMessage = ref<string>('Сервер не доступен')
const addServerErrorMessage = ref<string>('')

const itemsPerPage = 5
const currentPage = ref(1)
const isExpanded = ref(false)
const serverStore = useServerStore()

const updateServerStatuses = async () => {
  const statuses = new Map<string, boolean>()
  for (const server of serverStore.serverHistory) {
    try {
      const api = serverStore.createApiInstance(server)
      const status = await api.getStatus()
      statuses.set(server, status.status === 'ok')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        statuses.set(server, false)
      }
    }
  }

  serverStatuses.value = statuses
}

const getStatusIcon = (server: string) => {
  return serverStatuses.value.get(server) ? 'check_circle' : 'cancel'
}

const addServer = async () => {
  if (!newServerURL.value?.trim()) return

  const server = newServerURL.value.trim()
  if (serverStore.serverHistory.includes(server)){
    addServerErrorMessage.value = "Сервер с таким URL уже существует"
    return
  }
  const api = serverStore.createApiInstance(server)
  addServerErrorMessage.value = ''
  try {
    const status = await api.getStatus()

    if (status.status === "ok") {
      serverStore.serverHistory.push(server)
      serverStore.saveServerHistory()
      newServerURL.value = null
      updateServerStatuses()
      Notify.create({
        message: `Сервер успешно добавлен!`,
        color: 'green',
        position: 'bottom',
        timeout: 1000,
        progress: true,
      })
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e?.message) {
        addServerErrorMessage.value = e.message
      }
    }
  }
}

const removeServer = (index: number) => {
  const removedServerUrl = serverStore.serverHistory[index]
  serverStore.serverHistory.splice(index, 1)
  serverStore.saveServerHistory()
  updateServerStatuses()
  Notify.create({
    message: `The server is successfully removed! URL: ${removedServerUrl}`,
    color: 'red',
    position: 'bottom',
    timeout: 1000,
    progress: true,
  })
}

const editServer = (index: number) => {
  const originalServer = serverStore.serverHistory[index]
  editingIndex.value = index
  editedServer.value = originalServer ?? ''
}

const saveEdit = async (index: number) => {
  if (!editedServer.value.trim()) return

  const newServerUrl = editedServer.value.trim()

  try {
    const api = serverStore.createApiInstance(newServerUrl)
    const status = await api.getStatus()

    if (status.status === 'ok') {
      serverStore.serverHistory[index] = newServerUrl
      serverStore.saveServerHistory()
      await updateServerStatuses()
    }
  } catch (e) {
    if (e instanceof Error) {
      if (e?.message) {
        Notify.create({
          message: `Ошибка при редактировании сервера ${e.message}`,
          color: 'red',
          position: 'top'
        })
      }
    }
  }

  editingIndex.value = null
}

function clearLocalStorage (){
  localStorage.clear()
}

const maxPages = computed(() => Math.ceil(serverStore.serverHistory.length / itemsPerPage))

const paginatedServers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return serverStore.serverHistory.slice(start, end)
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
        <q-input
          v-model="newServerURL"
          label="Добавить сервер"
          outlined
          dense
          :error="!!addServerErrorMessage"
          :error-message="addServerErrorMessage"
        />
        <q-btn
          color="primary"
          label="Добавить"
          @click="addServer"
          class="q-mt-sm"
          size="sm"
          :disabled="!newServerURL"
        />
      </q-card-section>

      <q-card-section v-if="serverStore.serverHistory.length === 0" class="text-center">
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
            <p v-if="!serverStatuses.get(server)" class="text-red">{{ updateServerErrorMessage }}</p>
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
        v-if="serverStore.serverHistory.length > itemsPerPage"
        v-model="currentPage"
        :max="maxPages"
        boundary-links
        class="q-mt-md flex align-center"
      />
    </q-expansion-item>
  </q-card>
</template>
