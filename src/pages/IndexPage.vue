<script setup lang="ts">

import ServerList from 'components/server/ServerList.vue'
import { ServerDashboard } from 'src/widgets/ServerHistory'
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <ServerList/>
    <ServerDashboard/>
  </q-page>
</template>
