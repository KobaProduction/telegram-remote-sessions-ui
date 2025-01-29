<script setup lang="ts">

import ServerList from 'components/server/ServerList.vue'
import { ServerHistory } from 'src/widgets/ServerHistory'
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <ServerList/>
    <ServerHistory/>
  </q-page>
</template>
