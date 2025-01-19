<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/services/trsApiInstance'

const serverStatus = ref<'checking' | 'online' | 'offline'>('checking')
const serverErrorMessage = ref('')
const router = useRouter()


const checkServer = async () => {
  await api.getStatus(serverStatus, serverErrorMessage)
  if (serverStatus.value === 'online') {
    await router.push("/sessions")
  }
}

const restartServerCheck = () => {
  checkServer()
}

onMounted(() => {
  checkServer()
})
</script>

<template>
  <div v-if="serverStatus === 'checking'">
    Проверка состояния сервера...
  </div>
  <div v-if="serverStatus === 'online'">
    <h2>Меню управления сессиями</h2>
  </div>
  <div v-if="serverStatus === 'offline'">
    <p>{{ serverErrorMessage }}</p>
    <q-btn @click="restartServerCheck" color="primary" label="Перезапустить проверку" />
  </div>
</template>
