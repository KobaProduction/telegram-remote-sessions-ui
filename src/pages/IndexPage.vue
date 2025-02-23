<script setup lang="ts">

import ServerList from 'components/server/ServerList.vue'
import { ServerDashboard } from 'src/widgets/ServerHistory'
import ClearLocalStorageButton from 'src/shared/ui/button/ClearLocalStorageButton.vue'
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <ClearLocalStorageButton></ClearLocalStorageButton>
    <ServerList/>
    <ServerDashboard/>
  </q-page>
</template>
