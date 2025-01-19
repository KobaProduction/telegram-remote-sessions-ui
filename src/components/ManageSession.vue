<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits } from 'vue';
import { getSessionDetails, deleteSession } from 'src/services/sessionsService';

// Принимаем props
const props = defineProps<{ sessionName: string | null }>();
const emit = defineEmits(['close']);

// Данные сессии
const sessionDetails = ref<{ name: string; createdAt: string; status: string } | null>(null);

// Получаем детали сессии
const fetchSessionDetails = async () => {
  if (props.sessionName) {
    try {
      sessionDetails.value = await getSessionDetails(props.sessionName);
    } catch (error) {
      console.error('Ошибка при загрузке данных сессии:', error);
    }
  }
};

// Удаление сессии
const deleteSessionHandler = async () => {
  if (props.sessionName) {
    try {
      await deleteSession(props.sessionName);
      console.log('Сессия удалена');
      emit('close'); // Закрываем диалог
    } catch (error) {
      console.error('Ошибка при удалении сессии:', error);
    }
  }
};

// Загружаем данные при открытии
onMounted(() => {
  fetchSessionDetails();
});
</script>

<template>
  <q-card v-if="sessionDetails" class="q-pa-md">
    <q-card-section>
      <h3>Сессия: {{ sessionDetails.name }}</h3>
      <p>Создана: {{ sessionDetails.createdAt }}</p>
      <p>Статус: {{ sessionDetails.status }}</p>
    </q-card-section>

    <q-card-actions>
      <q-btn label="Удалить" color="negative" @click="deleteSessionHandler" />
      <q-btn label="Закрыть" color="primary" @click="$emit('close')" />
    </q-card-actions>
  </q-card>

  <div v-else>
    <p>Загрузка данных о сессии...</p>
  </div>
</template>

<style scoped>
.q-pa-md {
  padding: 15px;
}
</style>
