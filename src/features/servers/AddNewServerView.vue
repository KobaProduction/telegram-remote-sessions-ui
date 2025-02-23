<script setup lang="ts">
import { ref } from 'vue'

interface NewServerData {
  name: string,
  url: string,
}

const newServer = ref<NewServerData>({
  name: '',
  url: '',
})


const addServerErrorMessage = ref<string>('')
const addServerUrlErrorMessage = ref<string>('')



const addServer = () => {
  // serversStorageApi.addServer(newServer)
}
</script>

<template>
  <q-card-section class="q-gutter-y-md">
    <q-input
      v-model="newServer.name"
      label="Name"
      outlined
      dense
      :error="!!addServerErrorMessage"
      :error-message="addServerErrorMessage"
    />
    <q-input
      v-model="newServer.url"
      :label="$t('serverIpAddress')"
      outlined
      dense
      :error="!!addServerUrlErrorMessage"
      :error-message="addServerUrlErrorMessage"
    />
    <q-btn
      color="primary"
      label="Add server"
      @click="addServer"
      class="full-width"
      size="sm"
      :disabled="!newServer.url || !newServer.name"
    />
  </q-card-section>
</template>
