<script setup lang="ts">
// import ServerListItem from './ServerListItem.vue'

import { computed, ref } from 'vue'
// import { useServerStore } from '@/entities/servers'
// import type { ServerStatuses } from '../types/props'

// interface ServerListProps {
//   serverStatuses: ServerStatuses
// }

// const serverStore = useServerStore()

// const props = defineProps<ServerListProps>()

const maxPages = computed(() => 1
  // Math.ceil(Object.keys(serverStore.serverHistory).length / itemsPerPage),
)

// const itemsPerPage = 5
const currentPage = ref(1)

// const paginatedServers = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage
//   const end = start + itemsPerPage
//   return Object.entries(serverStore.serverHistory).slice(start, end)
// })
</script>

<template>
  <q-card-section classs="Object.keys(serverStore.serverHistory).length === 0" class="text-center">
    <div class="text-grey">The list of servers is empty</div>
  </q-card-section>
<!--  <q-list v-else bordered class="full-width">-->
<!--    <q-item-->
<!--      v-for="[serverName, serverUrl] in paginatedServers"-->
<!--      :key="serverName"-->
<!--      clickable-->
<!--      class="q-pa-sm"-->
<!--    >-->
<!--      <ServerListItem-->
<!--        :server-name="serverName"-->
<!--        :serverUrl="serverUrl"-->
<!--        :serverStatus="props.serverStatuses.get(serverName) || false"-->
<!--        :onConnectClick="() => console.log(123)"-->
<!--        :onConnectClickk="() => serverStore.connectToServer(props.serverUrl)"-->
<!--      />-->
<!--    </q-item>-->
<!--  </q-list>-->
  <q-pagination
    classs="Object.keys(serverStore.serverHistory).length > itemsPerPage"
    v-model="currentPage"
    :max="maxPages"
    boundary-links
    class="q-mt-md"
    input-class="text-primary"
  />
</template>
