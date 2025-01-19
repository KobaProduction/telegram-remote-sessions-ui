<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits } from 'vue';
import { api } from 'src/services/trsApiInstance';
import type { Session } from 'src/services/trsApiTypes';

const props = defineProps<{ sessionName: string | null }>();
const emit = defineEmits(['close']);

const sessionDetails = ref<Session | null>(null);

const fetchSessionDetails = async () => {
  if (props.sessionName) {
    try {
      sessionDetails.value = await api.getSessionDetails(props.sessionName)
    } catch (error) {
      console.error('Ошибка при загрузке данных сессии:', error);
    }
  }
};

const deleteSessionHandler = async () => {
  if (props.sessionName) {
    try {
      await api.deleteSession(props.sessionName);
      console.log('Сессия удалена');
      emit('close');
    } catch (error) {
      console.error('Ошибка при удалении сессии:', error);
    }
  }
};

onMounted(() => {
  fetchSessionDetails();
});
</script>

<template>
  <q-card v-if="sessionDetails" class="q-pa-md">
    <q-card-section>
      <h3>Сессия: {{ sessionDetails.name }}</h3>
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
