<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TelegramRemoteSessionApi } from 'src/shared/api/trs/telegramRemoteSessionApi'
import HintedInput from 'src/shared/ui/input/HintedInput.vue'
import { AxiosError } from 'axios'
import type { Device, SessionData } from './model'

const props = defineProps<{ api: TelegramRemoteSessionApi }>()

const isDialogOpen = ref(false)
const devices = ref<Device[]>(JSON.parse(localStorage.getItem('devices') || '[]') as Device[])
const isEditingDevice = ref(false)
const originalDeviceName = ref<string | null>(null)
const viewDevices = ref<boolean>(false)
const createSessionError = ref<string>('')
const defaultSessionData = {
  name: '',
  appVersion: '',
  langCode: '',
  deviceModel: '',
  systemVersion: '',
  systemLangCode: '',
  apiId: 1,
  apiHash: '',
  sessionName: ''
}

const sessionData = ref<SessionData>(structuredClone(defaultSessionData))

const deviceNameModalOpen = ref(false)
const deviceNameInput = ref('')

const currentPage = ref(1)
const rowsPerPage = ref(5)
const rowsPerPageOptions = [5, 10, 20] as const

const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return devices.value.slice(start, start + rowsPerPage.value)
})

const overwriteDialogOpen = ref(false)
const pendingOverwriteIndex = ref<number | null>(null)

const deleteConfirmDialogOpen = ref(false)
const pendingDeleteIndex = ref<number | null>(null)

const openDialog = () => {
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  isEditingDevice.value = false
  originalDeviceName.value = null
  sessionData.value = structuredClone(defaultSessionData)
}

const cancelAction = () => {
  if (isEditingDevice.value) {
    isEditingDevice.value = false
    originalDeviceName.value = null
  }
  createSessionError.value = ''
  closeDialog()
}

const saveDevice = () => {
  if (isEditingDevice.value) {
    saveDeviceData()
  } else {
    deviceNameModalOpen.value = true
  }
}

const confirmDeviceName = () => {
  if (!deviceNameInput.value.trim()) {
    createSessionError.value = 'Название устройства не может быть пустым'
    return
  }

  const existingIndex = devices.value.findIndex(d => d.deviceName === deviceNameInput.value)
  if (existingIndex !== -1 && !isEditingDevice.value) {
    pendingOverwriteIndex.value = existingIndex
    overwriteDialogOpen.value = true
  } else {
    saveDeviceData()
  }
}

const saveDeviceData = () => {
  const { ...deviceData } = sessionData.value

  if (isEditingDevice.value && originalDeviceName.value !== null) {
    const index = devices.value.findIndex(d => d.deviceName === originalDeviceName.value)
    if (index !== -1) {
      devices.value[index] = {
        deviceName: deviceNameInput.value,
        data: deviceData
      }
    }
  } else {
    devices.value.push({
      deviceName: deviceNameInput.value,
      data: deviceData
    })
  }

  localStorage.setItem('devices', JSON.stringify(devices.value))
  deviceNameModalOpen.value = false
  deviceNameInput.value = ''
}

const confirmOverwrite = () => {
  if (pendingOverwriteIndex.value !== null) {
    const { ...deviceData } = sessionData.value
    devices.value[pendingOverwriteIndex.value] = {
      deviceName: deviceNameInput.value,
      data: deviceData
    }
    localStorage.setItem('devices', JSON.stringify(devices.value))
    pendingOverwriteIndex.value = null
    overwriteDialogOpen.value = false
  }
}

const cancelOverwrite = () => {
  pendingOverwriteIndex.value = null
  overwriteDialogOpen.value = false
}

const loadDevice = (device: Device) => {
  sessionData.value = {
    ...sessionData.value,
    name: '',
    appVersion: device.data.appVersion,
    langCode: device.data.langCode,
    deviceModel: device.data.deviceModel,
    systemVersion: device.data.systemVersion,
    systemLangCode: device.data.systemLangCode,
    apiId: device.data.apiId,
    apiHash: device.data.apiHash,
    sessionName: ''
  }
  console.log(device.data.appVersion)
  createSessionError.value = `Используется устройство: ${device.deviceName}`
}

const editDevice = (index: number) => {
  const device = devices.value[index]
  if (!device) return
  originalDeviceName.value = device.deviceName
  deviceNameInput.value = device.deviceName
  sessionData.value = {
    ...sessionData.value,
    name: '',
    appVersion: device.data.appVersion,
    langCode: device.data.langCode,
    deviceModel: device.data.deviceModel,
    systemVersion: device.data.systemVersion,
    systemLangCode: device.data.systemLangCode,
    apiId: device.data.apiId,
    apiHash: device.data.apiHash,
    sessionName: ''
  }
  isEditingDevice.value = true
}

const requestDeleteDevice = (index: number) => {
  pendingDeleteIndex.value = index
  deleteConfirmDialogOpen.value = true
}

const confirmDeleteDevice = () => {
  if (pendingDeleteIndex.value !== null) {
    devices.value.splice(pendingDeleteIndex.value, 1)
    localStorage.setItem('devices', JSON.stringify(devices.value))
    pendingDeleteIndex.value = null
    deleteConfirmDialogOpen.value = false
    currentPage.value = 1
  }
}

const cancelDeleteDevice = () => {
  pendingDeleteIndex.value = null
  deleteConfirmDialogOpen.value = false
}

const emit = defineEmits<{
  (event: 'sessionCreated', sessionName: string): void
}>()

const createNewSession = async () => {
  try {
    const requestData = {
      name: sessionData.value.name,
      app_version: sessionData.value.appVersion,
      lang_code: sessionData.value.langCode,
      device_model: sessionData.value.deviceModel,
      system_version: sessionData.value.systemVersion,
      system_lang_code: sessionData.value.systemLangCode,
      api_id: sessionData.value.apiId,
      api_hash: sessionData.value.apiHash,
      session_name: sessionData.value.sessionName
    }

    await props.api.createSession(sessionData.value.name, requestData)
    emit('sessionCreated', sessionData.value.name)
    closeDialog()
  } catch (error) {
    if (error instanceof AxiosError) {
      createSessionError.value = error.message
    }
  }
}

const headerText = computed(() => isEditingDevice.value ? 'Редактирование устройства' : 'Создать новую сессию')

const sessionNameLabel = computed(() =>
  isEditingDevice.value ? `Device name (${sessionData.value.name})` : 'Session name'
)
</script>

<template>
  <div class="col self-center q-pa-md">
    <q-btn @click="openDialog" color="primary" label="Создать сессию" class="q-mt-md" />

    <q-dialog v-model="isDialogOpen">
      <q-card class="modal-card">
        <div class="row">
          <div class="col-12">
            <q-card-section>
              <div class="row items-center">
                <h6 class="q-ma-none">{{ headerText }}</h6>
              </div>
              <HintedInput
                v-model="sessionData.name"
                :label="sessionNameLabel"
                hint="Use only English letters and numbers (max 15 characters)."
              />
              <HintedInput
                v-model="sessionData.appVersion"
                label="App version"
                hint="Attention! Use actual telegram version!"
              />
              <HintedInput
                v-model="sessionData.langCode"
                label="Language"
                hint="Attention! Use real lang code like en, kz, ru"
              />
              <HintedInput
                v-model="sessionData.deviceModel"
                label="Device model"
                hint="Use your device model, for example: POCO C51, HP Laptop 15-dw1xxx"
              />
              <HintedInput
                v-model="sessionData.systemVersion"
                label="System version"
                hint="Use the version of your system, for example: Windows 11, Android 12"
              />
              <HintedInput
                v-model="sessionData.systemLangCode"
                label="Device language"
                hint="Use the language of your system, for example: en, ru, kz"
              />
              <HintedInput
                v-model="sessionData.apiId"
                label="API ID"
                hint="Attention! Use correct API ID from https://my.telegram.org/apps."
              />
              <p class="text-caption"> You can get it here  <a href="https://my.telegram.org/apps">my.telegram.org/apps</a></p>
              <HintedInput
                v-model="sessionData.apiHash"
                label="API Hash"
                hint="Attention! Use correct API Hash from https://my.telegram.org/apps."
              />
              <p class="text-caption"> You can get it here  <a href="https://my.telegram.org/apps">my.telegram.org/apps</a></p>
            </q-card-section>
            <q-card-actions align="right">
              <q-toggle v-model="viewDevices" label="Девайсы" class="q-mt-sm" />
              <q-btn-group flat unelevated>
                <q-btn label="Выйти" color="negative" @click="cancelAction" />
                <q-btn
                  v-if="!isEditingDevice"
                  label="Создать"
                  color="primary"
                  @click="createNewSession"
                  :disable="!sessionData.name"
                />
                <q-btn label="Сохранить устройство" color="secondary" @click="saveDevice" />
              </q-btn-group>
            </q-card-actions>
            <div v-if="createSessionError" class="text-red flex justify-center items-center text-center">
              {{ createSessionError }}
            </div>
          </div>

          <div v-if="viewDevices" class="col-12">
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <h6 class="q-ma-none">Девайсы</h6>
                <q-select
                  v-model="rowsPerPage"
                  :options="rowsPerPageOptions"
                  dense
                  outlined
                  style="max-width: 100px;"
                  label="На странице"
                />
              </div>
              <q-list v-if="devices.length">
                <q-item v-for="(device, index) in paginatedDevices" :key="index" clickable>
                  <q-item-section avatar>
                    <q-icon name="devices" />
                  </q-item-section>
                  <q-item-section class="device-name">
                    <q-item-label class="device-label text-truncate">
                      {{ device.deviceName }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn-group flat dense>
                      <q-btn icon="play_arrow" @click="loadDevice(device)" />
                      <q-btn icon="edit" @click="editDevice((currentPage - 1) * rowsPerPage + index)" />
                      <q-btn icon="delete" color="negative" @click="requestDeleteDevice((currentPage - 1) * rowsPerPage + index)" />
                    </q-btn-group>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-center">Нет сохраненных устройств</div>
              <div class="row items-center justify-center q-mt-sm">
                <q-pagination
                  v-model="currentPage"
                  :max="Math.ceil(devices.length / rowsPerPage)"
                  color="primary"
                  boundary-numbers
                />
              </div>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deviceNameModalOpen" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Введите название устройства</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="deviceNameInput"
            label="Название устройства"
            autofocus
            @keyup.enter="confirmDeviceName"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="negative" @click="deviceNameModalOpen = false" />
          <q-btn flat label="Сохранить" color="primary" @click="confirmDeviceName" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="overwriteDialogOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">
            Устройство с таким названием уже существует. Вы не изменили имя устройства и оно будет перезаписано.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Нет" color="negative" flat @click="cancelOverwrite" />
          <q-btn label="Да" color="primary" flat @click="confirmOverwrite" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteConfirmDialogOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">
            Вы действительно хотите удалить устройство?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Нет" color="negative" flat @click="cancelDeleteDevice" />
          <q-btn label="Да" color="primary" flat @click="confirmDeleteDevice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
