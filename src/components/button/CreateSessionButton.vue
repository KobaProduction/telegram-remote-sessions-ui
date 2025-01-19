<script setup lang="ts">

import { createSession } from 'src/services/sessionsService';

const createNewSession = async () => {
  try {
    const name = "fffff"; // Можно изменить логику создания имени
    await createSession(name);
    console.log('Сессия создана');
  } catch (error) {
    console.error('Ошибка при создании сессии:', error);
  }
};
</script>

<template>
  <div class="col self-center">
    <q-btn
      @click="createNewSession"
      color="primary"
      label="Создать сессию"
    />
  </div>
</template>
