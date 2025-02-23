<script setup lang="ts">

import { computed, ref } from 'vue'

import type { ServerHistoryItem } from '@/entities/servers'
import ServerHistoryItemView from '@/widgets/servers/ui/ServerHistoryItemView.vue'

interface ServersMemory {
  [id: string]: ServerHistoryItem
}

const serversMemory: ServersMemory = {
  '123': {
    name: '123',
    url: 'http://localhost:8080',
    connected: false,
  },
}

const itemsPerPage = 5

const maxPages = computed(() => Math.ceil(Object.keys(serversMemory).length / itemsPerPage))
const currentPage = ref(1)

const paginatedServers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return Object.entries(serversMemory).slice(start, end)
})

</script>

<template>
  <q-card-section v-if="!Object.keys(serversMemory).length">
    <div class="text-center text-grey">The list of servers is empty</div>
  </q-card-section>
  <q-list v-else bordered class="full-width">
    <q-item
      v-for="[serverId, serverData] in paginatedServers"
      :key="serverId"
      clickable
      class="q-pa-sm"
    >
      <ServerHistoryItemView
        :name="serverData.name"
        :url="serverData.url"
        :connected="serverData.connected"
      />
    </q-item>
  </q-list>
  <q-pagination
    classs="Object.keys(serverStore.serverHistory).length > itemsPerPage"
    v-model="currentPage"
    :max="maxPages"
    boundary-links
    class="q-mt-md"
    input-class="text-primary"
  />
</template>
