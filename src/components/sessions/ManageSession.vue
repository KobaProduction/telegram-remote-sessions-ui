<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ApiResponse, Session } from 'src/shared/api/trs/model'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'
import { AxiosError } from 'axios'

const props = defineProps<{ sessionName: string; api: TelegramRemoteSessionApi }>()
const emit = defineEmits(['close'])

const sessionDetails = ref<Session | null>(null)
const isActiveSelected = ref<boolean>(true) // по умолчанию
const isActiveOptions = ['true', 'false']

const errorMessage = ref<string>('')

async function fetchSessionDetails() {
  try {
    sessionDetails.value = await props.api.getSessionDetails(props.sessionName)
    isActiveSelected.value = sessionDetails.value.is_active
  } catch (error) {
    console.error('Ошибка при загрузке данных сессии:', error)
  }
}

const updateSessionHandler = async () => {
  if (!sessionDetails.value) return
  const proxy = sessionDetails.value.proxy === '' ? 'null' : sessionDetails.value.proxy
  try {
    await props.api.updateSession(props.sessionName, isActiveSelected.value, proxy)
    errorMessage.value = ''
  } catch (e) {
    if (e instanceof AxiosError && e?.response?.data) {
      const response: ApiResponse = e.response.data
      errorMessage.value = response.message
    }
  }
}

const deleteSessionHandler = async () => {
  try {
    await props.api.deleteSession(props.sessionName)
    console.log('Сессия удалена')
    emit('close')
  } catch (error) {
    console.error('Ошибка при удалении сессии:', error)
  }
}

onMounted(fetchSessionDetails)
</script>

<template>
  <q-card v-if="sessionDetails" class="q-pa-md" style="max-width: 600px; margin: 0 auto">
    <q-card-section class="q-gutter-md">
      <h3 class="text-center">Сессия: {{ props.sessionName }}</h3>

      <div>
        <q-select
          v-model="isActiveSelected"
          :options="isActiveOptions"
          label="Статус активности"
          dense
        />
      </div>

      <div>
        <q-input
          v-model="sessionDetails.session_parameters.app_version"
          label="Версия приложения"
          dense
          disable
        />
      </div>

      <div>
        <q-input v-model="sessionDetails.session_parameters.lang_code" label="Язык" dense disable />
      </div>

      <div>
        <q-input
          v-model="sessionDetails.session_parameters.device_model"
          label="Модель устройства"
          dense
          disable
        />
      </div>

      <div>
        <q-input
          v-model="sessionDetails.session_parameters.system_version"
          label="Система"
          dense
          disable
        />
      </div>

      <div>
        <q-input
          v-model="sessionDetails.session_parameters.system_lang_code"
          label="Язык системы"
          dense
          disable
        />
      </div>

      <div>
        <q-input v-model="sessionDetails.session_parameters.api_id" label="API ID" dense disable />
      </div>

      <div>
        <q-input
          v-model="sessionDetails.session_parameters.api_hash"
          label="API Hash"
          dense
          disable
        />
      </div>

      <!-- Прокси -->
      <div>
        <q-input v-model="sessionDetails.proxy" label="Proxy" dense />
      </div>
      <p v-if="errorMessage" class="text-red">{{ errorMessage }}</p>
      <!-- Кнопки сохранения и удаления -->
      <div class="q-mt-md q-gutter-sm" style="display: flex; justify-content: space-between">
        <q-btn :label="'Сохранить'" color="positive" @click="updateSessionHandler" />
        <q-btn label="Удалить" color="negative" @click="deleteSessionHandler" />
      </div>

      <!-- Кнопка закрытия -->
      <q-btn label="Закрыть" color="primary" @click="emit('close')" class="q-mt-md" />
    </q-card-section>
  </q-card>

  <div v-else>
    <p>Загрузка данных о сессии...</p>
  </div>
</template>
