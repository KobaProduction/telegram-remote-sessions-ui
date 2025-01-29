<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isAxiosError } from 'axios'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'

const serverStatus = ref<'checking' | 'online' | 'offline'>('checking')
const serverErrorMessage = ref('')

const props = defineProps<{
  api: TelegramRemoteSessionApi;
}>();

const checkServer = async () => {
  try {
    const status = await props.api.getStatus()
    console.log(status)
    if (status) {
      serverStatus.value = 'online'
      serverErrorMessage.value = ''
    } else {
      serverStatus.value = 'offline'
      serverErrorMessage.value = 'Неожиданный ответ от сервера.'
    }
  } catch (error) {
    console.error(isAxiosError(error) ? `Ошибка запроса: ${error.message}` : `Неизвестная ошибка: ${error}`)
    serverStatus.value = 'offline'
    serverErrorMessage.value = 'Сервер выключен. Пожалуйста, включите его.'
}



  console.log(serverStatus.value)
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
