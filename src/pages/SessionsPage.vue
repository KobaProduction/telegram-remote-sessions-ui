<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/services/trsApiInstance';
import SessionList from 'components/SessionList.vue';
import CreateSessionButton from 'components/button/CreateSessionButton.vue';
import type { Session, SessionsResponse } from 'src/services/trsApiTypes';

const sessions = ref<Session[]>([]);
const currentPage = ref(1);
const totalSessions = ref(0);
const sessionsPerPage = 5;

// Функция для получения сессий с сервера
const fetchSessions = async () => {
  try {
    const data = await api.getSessions(currentPage.value, sessionsPerPage) as SessionsResponse;
    sessions.value = data.sessions;
    totalSessions.value = data.total;
  } catch (error) {
    console.error('Ошибка при загрузке сессий:', error);
  }
};

// Загружаем сессии при монтировании
onMounted(() => {
  fetchSessions();
});

// Обработчик для обновления списка сессий после создания новой
const handleSessionCreated = () => {
  fetchSessions();
};
</script>

<template>
  <div class="column">
    <CreateSessionButton @sessionCreated="handleSessionCreated" />

    <div v-if="sessions.length" class="col self-center">
      <SessionList
        :sessions="sessions"
        :totalSessions="totalSessions"
        :currentPage="currentPage"
      />
    </div>

    <div v-else>
      <p class="text-center">Сессии не найдены.</p>
    </div>

    <div>
      <q-pagination
        v-if="totalSessions > sessionsPerPage"
        v-model="currentPage"
        :max="Math.ceil(totalSessions / sessionsPerPage)"
        class="q-pa-xs"
      />
    </div>
  </div>
</template>
