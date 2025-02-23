<script setup lang="ts">
import { computed, ref } from 'vue'

import ServerHistoryItemView from '@/widgets/servers/ui/ServerHistoryItemView.vue'
import {useMemoryServersStore } from '@/entities/servers'
import type {ServerHistoryItem } from '@/entities/servers'

const memoryStorage = useMemoryServersStore()

const itemsPerPage = 5

const maxPages = computed(() =>
  Math.ceil(Object.keys(memoryStorage.serversHistory).length / itemsPerPage),
)
const currentPage = ref(1)

const paginatedServers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return Object.entries(memoryStorage.serversHistory).slice(start, end)
})


const onDelete = (id: string) => {
  memoryStorage.deleteServer(id)
  // todo confirm deleting
}

const onEdit = (id: string, data: ServerHistoryItem) => {
  memoryStorage.editServer(id, data)
}

const onConnect = (id: string) => {
  memoryStorage.connectToServer(id)
}

</script>

<template>
  <q-card-section v-if="!Object.keys(memoryStorage.serversHistory).length">
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
        :id="serverId"
        :data="serverData"
        :is-connected="serverData.connected"
        :onDelete="onDelete"
        :onEdit="onEdit"
        :onConnect="onConnect"
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
