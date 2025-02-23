<script setup lang="ts">
import { ref } from 'vue'
import AddNewServerView from '@/features/servers/AddNewServerView.vue'
import ServersHistoryList from '@/widgets/servers/ui/ServersHistoryList.vue'

const isExpanded = ref(true)

</script>

<template>
  <q-card class="q-pa-md">
    <q-expansion-item
      v-model="isExpanded"
      icon="list"
      label="List of servers"
      class="full-width"
    >
      <AddNewServerView/>
      <ServersHistoryList />
    </q-expansion-item>
  </q-card>
</template>
