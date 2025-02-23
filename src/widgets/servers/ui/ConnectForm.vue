<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'

import { useMemoryServersStore, useStaticServersStore } from '@/entities/servers'

const { t } = useI18n()
const serversStaticStore = useStaticServersStore()
const serversMemoryStore = useMemoryServersStore()
const errorMessage = ref<string>('')
const rememberServer = ref<boolean>(false)
const connectServerURL = ref<string>(serversStaticStore.lastConnectedServerUrl || "")


const connect = async () => {
  try {
    await serversMemoryStore.connect(connectServerURL.value)
    serversStaticStore.setLastConnectedServerUrl(connectServerURL.value)
    errorMessage.value = ""
  } catch (error) {
    if (error instanceof TypeError) {
      errorMessage.value = t("incorrectUrl")
    } else if (error instanceof AxiosError) {
      errorMessage.value = error?.message || 'Unknown error'
    }
  }
}

</script>

<template>
  <div class="server-form">
    <p>Enter the server</p>
    <q-input
      v-model="connectServerURL"
      label="Server URL"
      outlined
      :error="!!errorMessage"
      :error-message="errorMessage"
    />
    <div class="q-mt-sm">
      <q-checkbox v-model="rememberServer" label="Remember server?" class="q-mr-lg" />
      <q-btn
        @click="connect"
        color="primary"
        :disable="!connectServerURL"
        label="Connect"
      />
    </div>
  </div>
</template>

<style scoped></style>
