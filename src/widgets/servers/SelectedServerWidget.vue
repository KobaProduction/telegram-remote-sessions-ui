<script setup lang="ts">
import ServerView from '@/widgets/servers/ui/ServerView.vue'
import ConnectForm from '@/widgets/servers/ui/ConnectForm.vue'
import { useMemoryServersStore } from '@/entities/servers'

const serversMemoryStore = useMemoryServersStore()
</script>

<template>
  <q-card class="q-pa-sm">
    <ConnectForm v-if="!serversMemoryStore.connectedServer"/>
    <ServerView v-else />
    <q-btn v-if="serversMemoryStore.connectedServer"
      color="negative"
      label="Disconnect"
      @click="serversMemoryStore.disconnect"
      class="q-mt-sm"
      size="sm"
    />
  </q-card>
</template>
