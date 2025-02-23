<script setup lang="ts">
import { ref } from 'vue'
import { useServerStore } from 'src/shared/api/server/serverStore'
import type { AxiosError } from 'axios'

const serverURL = ref(localStorage.getItem('savedServer') || '')
const rememberServer = ref<boolean>(false)
const error = ref<string>('')
const serverStore = useServerStore()

const connect = async (serverURL: string, rememberServer: boolean) => {
  error.value = ''
  try {
    await serverStore.connectToServer(serverURL, rememberServer)
  } catch (e) {
    const axiosError = e as AxiosError
    error.value = (axiosError.response?.data as {
      message?: string
    })?.message || axiosError.message || 'Unknown error'
  }
}

</script>

<template>
  <div class="server-form">
    <p>Enter the server</p>
    <q-input
      v-model="serverURL"
      label="Server URL" outlined
      :error="!!error"
      :error-message="error"
    />
    <div class="q-mt-sm">
      <q-checkbox v-model="rememberServer" label="Remember server?" class="q-mr-lg" />
      <q-btn @click="connect(serverURL, rememberServer)" color="primary" :disable="!serverURL" label="Connect"/>
    </div>

  </div>
</template>

<style scoped>

</style>
