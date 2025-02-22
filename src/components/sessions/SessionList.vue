<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ManageSession from 'components/sessions/ManageSession.vue'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'

const props = defineProps<{
  sessions: string[];
  api: TelegramRemoteSessionApi;
}>()

const searchQuery = ref<string>('')

const sessionsPerPageOptions = [5, 10, 15, 20]

const sessionsPerPage = ref<number>(parseInt(localStorage.getItem('sessionsPerPage') || '5', 10))

const currentPage = ref<number>(1)

const filteredSessions = computed(() => {
  if (!searchQuery.value) {
    return props.sessions
  }
  return props.sessions.filter((session) =>
    session.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / sessionsPerPage.value)
})

const pageSessions = computed(() => {
  const start = (currentPage.value - 1) * sessionsPerPage.value
  const end = start + sessionsPerPage.value
  return filteredSessions.value.slice(start, end)
})

const updateSessionsPerPage = (value: number) => {
  sessionsPerPage.value = value
  localStorage.setItem('sessionsPerPage', value.toString())
  currentPage.value = 1
}

watch(searchQuery, () => {
  currentPage.value = 1
})

const selectedSession = ref<string | null>(null)
const isDialogOpen = ref(false)

const openSession = (session: string) => {
  selectedSession.value = session
  isDialogOpen.value = true
}

const closeSession = () => {
  selectedSession.value = null
  isDialogOpen.value = false
}
</script>

<template>
  <div class="q-py-md" style="min-height: 550px">
    <q-input
      v-model="searchQuery"
      label="Session name"
      outlined
      dense
      class="q-mb-md"
    />
    <q-select
      v-model="sessionsPerPage"
      :options="sessionsPerPageOptions"
      label="Sessions per page"
      outlined
      dense
      class="q-mb-md"
      @update:model-value="updateSessionsPerPage"
    />
    <div v-if="filteredSessions.length === 0">
      <q-banner class="bg-warning text-black">
        No session with this name was found
      </q-banner>
    </div>
    <div v-else>
      <div v-for="session in pageSessions" :key="session" class="temp">
        <q-card class="row">
          <q-card-section>
            <p class="q-ma-none">{{ session }}</p>
          </q-card-section>
          <q-card-section class="q-pa-none q-ml-auto">
            <q-card-actions align="center">
              <q-btn
                label="open"
                color="secondary"
                @click="openSession(session)"
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
      <q-pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        direction-links
        boundary-links
        :max="totalPages"
        class="q-pa-xs q-mt-md"

      />
    </div>
    <q-dialog v-model="isDialogOpen">
      <ManageSession
        v-if="selectedSession"
        :sessionName="selectedSession"
        :api="props.api"
        @close="closeSession"
      />
    </q-dialog>
  </div>
</template>

<style scoped>
.temp {
  padding: 5px;
  min-width: 300px;
  max-width: 350px;
}
</style>
