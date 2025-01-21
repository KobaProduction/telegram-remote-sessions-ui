<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const serverURL = ref('');
const emit = defineEmits(['connect']);

const connect = () => {
  emit('connect', serverURL.value);
};
</script>

<template>
  <div class="server-form">
    <p>Введите сервер</p>
    <q-input v-model="serverURL" label="URL сервера" outlined />
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
