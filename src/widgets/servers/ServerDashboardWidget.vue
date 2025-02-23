<script setup lang="ts">
import { ref } from 'vue'
// import { Notify } from 'quasar'
// import { AxiosError } from 'axios'
//
// import { useServerStore } from '@/entities/servers'
// import ServerList from '@/widgets/servers/ui/ServerList.vue'
// import type { ServerStatuses } from '@/widgets/servers/types/props'
// import { ServersStorageApi } from '@/entities/servers/api'


// const serversStorageApi = new ServersStorageApi()


// interface NewServerData {
//   name: string,
//   url: string,
// }

// const newServer = ref<NewServerData>({
//   name: '',
//   url: '',
// })
//
//
//
// const addServerErrorMessage = ref<string>('')
// const addServerUrlErrorMessage = ref<string>('')

const isExpanded = ref(true)

// const statuses: ServerStatuses = new Map()

</script>

<template>
  <q-card class="q-pa-md">
<!--    <q-banner v-if="serversStore.isConnected" class="q-mb-md">-->
<!--      <div class="text-h6">Connected to server: {{ serverStore.lastConnectedServerUrl }}</div>-->
<!--      <q-btn-->
<!--        color="negative"-->
<!--        label="Disconnect"-->
<!--        @click="serverStore.disconnectFromServer()"-->
<!--        class="q-mt-sm"-->
<!--        size="sm"-->
<!--      />-->
<!--    </q-banner>-->
    <q-expansion-item
      v-model="isExpanded"
      icon="list"
      label="List of servers"
      class="full-width"
    >
<!--      <q-card-section class="q-gutter-y-md">-->
<!--        <q-input-->
<!--          v-model="newServer.name"-->
<!--          label="Name"-->
<!--          outlined-->
<!--          dense-->
<!--          :error="!!addServerErrorMessage"-->
<!--          :error-message="addServerErrorMessage"-->
<!--        />-->
<!--        <q-input-->
<!--          v-model="newServer.url"-->
<!--          :label="$t('serverIpAddress')"-->
<!--          outlined-->
<!--          dense-->
<!--          :error="!!addServerUrlErrorMessage"-->
<!--          :error-message="addServerUrlErrorMessage"-->
<!--        />-->
<!--        <q-btn-->
<!--          color="primary"-->
<!--          label="Add server"-->
<!--          @click="serversStorageApi.addServer(newServer)"-->
<!--          class="full-width"-->
<!--          size="sm"-->
<!--          :disabled="!newServer.url || !newServer.name"-->
<!--        />-->
<!--      </q-card-section>-->



<!--      <ServerList :server-statuses="statuses"/>-->


    </q-expansion-item>
  </q-card>
</template>
