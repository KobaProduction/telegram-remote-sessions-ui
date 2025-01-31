<script setup lang="ts">
import { ref, computed } from 'vue'
import ManageSession from 'components/sessions/ManageSession.vue'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'

const props = defineProps<{
  sessions: string[];
  api: TelegramRemoteSessionApi;
}>()

const sessionsPerPage = 5
const currentPage = ref<number>(1)

const totalPages = computed(() => {
  return Math.ceil(props.sessions.length / sessionsPerPage)
})

const pageSessions = computed(() => {
  const start = (currentPage.value - 1) * sessionsPerPage
  const end = start + sessionsPerPage
  return props.sessions.slice(start, end)
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
  <div class="q-py-md" style="min-height: 350px">
    <div v-for="session in pageSessions" :key="session" class="temp">
      <q-card class="row">
        <q-card-section>
          <p class="q-ma-none">{{ session }}</p>
        </q-card-section>
        <q-card-section class="q-pa-none q-ml-auto">
          <q-card-actions align="center">
            <q-btn label="УПРАВЛЯТЬ" color="secondary" @click="openSession(session)" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div>
    <q-pagination
      v-if="totalPages > 1"
      v-model="currentPage"
      :max="totalPages"
      class="q-pa-xs"
    />
  </div>

  <q-dialog v-model="isDialogOpen">
    <ManageSession v-if="selectedSession" :sessionName="selectedSession" :api="props.api" @close="closeSession" />
  </q-dialog>
</template>

<style scoped>
.temp {
  padding: 5px;
  min-width: 300px;
  max-width: 350px;
}
</style>
