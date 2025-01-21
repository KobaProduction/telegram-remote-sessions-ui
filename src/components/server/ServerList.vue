<script setup lang="ts">

import ServerView from 'components/server/ServerView.vue'
import { onMounted, ref } from 'vue'
import { TrsApi } from 'src/services/trs/api'
import ConnectForm from 'components/server/ConnectForm.vue'

const selectedServerApi = ref<TrsApi>(new TrsApi(""));
const api = ref<TrsApi>(new TrsApi(""));
const isConnected = ref(false);

async function loadServer() {
  const storedServer = localStorage.getItem('serverUrl');
  if (storedServer) {
    api.value = new TrsApi(storedServer);
    console.log(api.value);
    const status = await api.value.getStatus();
      if (status === "ok"){
        const selectedServerApi = api.value;
        isConnected.value = true;
        return selectedServerApi
      }
    } else {
      localStorage.removeItem('serverUrl');
      isConnected.value = false;
    }
  }


const connectToServer = (serverUrl: string) => {
  localStorage.setItem('serverUrl', serverUrl);
  selectedServerApi.value = new TrsApi(serverUrl);
  isConnected.value = true;
};


onMounted(loadServer);
</script>

<template>

  <div v-if="isConnected">
    <ServerView :api="selectedServerApi" />

  </div>
  <div v-else>
    <p>Server not selected</p>
    <ConnectForm @connect="connectToServer"/>
  </div>

</template>

<style scoped>

</style>
