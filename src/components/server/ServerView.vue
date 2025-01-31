<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SessionList from 'components/sessions/SessionList.vue'
// import CreateSessionButton from 'components/server/sessions/CreateSession.vue'
import type { SessionListResponse } from 'src/shared/api/trs/model'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'

const sessions = ref<string[] | null>(null)
const error = ref<string>("")


const props = defineProps<{
  api: TelegramRemoteSessionApi;
}>();



const fetchSessions = async () => {
  try {
    const data: SessionListResponse = await props.api.getSessions()
    sessions.value = data.sessions
  } catch (e) {
    error.value = `Error when trying to load sessions: ${e}`
  }
}
onMounted(fetchSessions)
</script>

<template>
  <div class="column">
<!--    <CreateSessionButton @sessionCreated="fetchSessions" />-->
    <div v-if="sessions" class="col self-center">
      <SessionList :sessions="sessions" :api="props.api"/>
    </div>
    <div v-else>
      <p class="text-center">{{ error }}</p>
    </div>
  </div>
</template>
