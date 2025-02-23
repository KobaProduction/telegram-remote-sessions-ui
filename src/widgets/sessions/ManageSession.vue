<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ApiResponse, Session } from '@/shared/api/trs/model'
import type { TelegramRemoteSessionApi } from '@/shared/api/trs/telegramRemoteSessionApi'
import { AxiosError } from 'axios'
import type { Device } from '@/widgets/sessions/CreateSession/model'
import { Notify } from 'quasar'
import { useDeviceStore } from '@/entities/devices'

const props = defineProps<{ sessionName: string; api: TelegramRemoteSessionApi }>()
const emit = defineEmits(['close'])

const deviceStore = useDeviceStore()
const devices = deviceStore.devices
const deviceNameModalOpen = ref(false)
const deviceNameInput = ref<string>('')
const deviceNameError = ref<string>('')

const sessionDetails = ref<Session | null>(null)
const isActiveSelected = ref<boolean>(true)
const isActiveOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]
const errorMessage = ref<string>('')

async function fetchSessionDetails() {
  try {
    sessionDetails.value = await props.api.getSessionDetails(props.sessionName)
    isActiveSelected.value = sessionDetails.value.is_active
  } catch (error) {
    console.error('Error when downloading these session:', error)
  }
}

const updateSessionHandler = async () => {
  if (!sessionDetails.value) return
  const proxy = sessionDetails.value.proxy === '' ? 'null' : sessionDetails.value.proxy
  try {
    await props.api.updateSession(props.sessionName, isActiveSelected.value, proxy)
    emit('close')
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
    Notify.create({
      message: `Session ${props.sessionName} deleted`,
      position: 'bottom',
      color:'red',
      timeout: 1000,
      progress: true,
    })
    emit('close')
  } catch (error) {
    console.error('Ошибка при удалении сессии:', error)
  }
}

function showSaveAsDevice(){
  deviceNameModalOpen.value = true
}

function saveDevice() {
  const newDeviceName = deviceNameInput.value.trim()
  if (!newDeviceName) {
    deviceNameError.value = 'The name of the device cannot be empty'
    return
  }
  if (devices.some(device => device.deviceName === newDeviceName)) {
    deviceNameError.value = 'A device with this name already exists!'
    return
  }
  const newDevice: Device = {
    deviceName: newDeviceName,
    data:{
      sessionName: props.sessionName,
      appVersion: sessionDetails.value?.session_parameters.app_version || '',
      langCode: sessionDetails.value?.session_parameters.lang_code || '',
      deviceModel: sessionDetails.value?.session_parameters.device_model || '',
      systemVersion: sessionDetails.value?.session_parameters.system_version || '',
      systemLangCode: sessionDetails.value?.session_parameters.system_lang_code || '',
      apiId: sessionDetails.value?.session_parameters.api_id || 1,
      apiHash: sessionDetails.value?.session_parameters.api_hash || '',
    }
  }

  deviceStore.saveDevice(newDevice)

  Notify.create({
    message: 'The device is successfully saved',
    position: 'bottom',
    color:'green',
    timeout: 1000,
    progress: true,
  })
  deviceNameModalOpen.value = false
}


// async function checkProxy(proxy: string | null) {
//   if (!proxy) return;
//   console.log(`Проверяю прокси: ${proxy}`);
//
//   try {
//     const agent = new SocksProxyAgent(proxy);
//
//     const response = await axios.request({
//       url: 'https://api.ipify.org?format=json',
//       httpAgent: agent,  // для http
//       httpsAgent: agent  // для https
//     });
//
//     console.log('IP:', response.data.ip);
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.error('Ошибка:', error.message);
//     }
//   }
// }

onMounted(fetchSessionDetails)
</script>

<template>
    <q-card v-if="sessionDetails" class="q-pa-md q-mx-auto">
      <q-card-section>
        <h4 class="text-center">Сессия: {{ props.sessionName }}</h4>
        <div class="row q-gutter-sm justify-center q-mt-sm">
          <p>Status: </p>
          <q-chip
            dense
            :color="sessionDetails.is_broken ? 'red' : 'green'"
            text-color="white"
          >
            {{ sessionDetails.is_broken ? 'Broken' : 'Not broken' }}
          </q-chip>
          <q-chip
            dense
            :color="sessionDetails.is_authenticated ? 'positive' : 'negative'"
            text-color="white"
          >
            {{ sessionDetails.is_authenticated ? 'Authenticated' : 'Not authenticated' }}
          </q-chip>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="isActiveSelected"
          :options="isActiveOptions"
          label="Activity status"
          dense
          emit-value
          map-options
          behavior="menu"
        />
        <div class="row q-gutter-md">
          <q-input
            v-model="sessionDetails.session_parameters.app_version"
            label="Версия приложения"
            dense
            disable
            class="col-6 full-width"

          />
          <q-input
            v-model="sessionDetails.session_parameters.lang_code"
            label="Язык"
            dense
            disable
            class="col-6 full-width"
          />
          <q-input
            v-model="sessionDetails.session_parameters.device_model"
            label="Модель устройства"
            dense
            disable
            class="col-12 full-width"
          />
          <q-input
            v-model="sessionDetails.session_parameters.system_version"
            label="Система"
            dense
            disable
            class="col-6 full-width"
          />
          <q-input
            v-model="sessionDetails.session_parameters.system_lang_code"
            label="Язык системы"
            dense
            disable
            class="col-6 full-width"
          />
        </div>
        <q-input v-model="sessionDetails.session_parameters.api_id" label="API ID" dense disable class="col-6" />
        <q-input v-model="sessionDetails.session_parameters.api_hash" label="API Hash" dense disable class="col-6" />
        <q-input
          v-model="sessionDetails.proxy"
          label="Proxy"
          dense
          :error="!!errorMessage"
          :error-message="errorMessage"
        />
        <!--        <q-btn-->
        <!--          @click="checkProxy(sessionDetails.proxy)"-->
        <!--          label="Check"-->
        <!--          :disable="!sessionDetails.proxy"-->
        <!--        />-->
        <q-separator />
        <div class="row q-mt-md q-gutter-sm justify-between">
          <q-btn label="Save" color="positive" @click="updateSessionHandler" />
          <q-btn label="Save as Device" color="secondary" @click="showSaveAsDevice"></q-btn>
          <q-btn label="Delete" color="negative" @click="deleteSessionHandler" />
        </div>
        <q-btn label="Close" color="primary" @click="emit('close')" class="q-mt-md full-width" />
      </q-card-section>
    </q-card>

  <div v-else>
    <p>Loading data about the session...</p>
  </div>

  <q-dialog v-model="deviceNameModalOpen">
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Enter the name of the device</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="deviceNameInput"
          label="Device name"
          autofocus
          :error="!!deviceNameError"
          :error-message="deviceNameError"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="deviceNameModalOpen = false" />
        <q-btn flat label="Save" color="primary" @click="saveDevice" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>
