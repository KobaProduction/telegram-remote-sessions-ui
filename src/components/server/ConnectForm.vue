<script setup lang="ts">
import { ref } from 'vue'

const serverURL = ref(localStorage.getItem('savedServer') || '')
const rememberServer = ref(false)
const emit = defineEmits(['onConnect'])

const connect = () => {
  emit('onConnect', serverURL.value, rememberServer.value)
}
</script>

<template>
  <div class="server-form">
    <p>Введите сервер</p>
    <q-input v-model="serverURL" label="Server URL" outlined />
    <q-checkbox v-model="rememberServer" label="Запомнить сервер?" class="q-mt-sm" />
    <q-btn @click="connect" color="primary" class="q-mt-md">Подключиться</q-btn>
  </div>
</template>

<style scoped>
.server-form {
  max-width: 300px;
  margin: auto;
  text-align: center;
}
</style>
