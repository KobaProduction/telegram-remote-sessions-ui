<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/services/trsApiInstance'; // Подключаем экземпляр api
import ManageSession from 'components/ManageSession.vue';

// Стейт для сессий (массив строк)
const sessions = ref<string[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const selectedSession = ref<string | null>(null);
const isDialogOpen = ref(false); // Переменная для отображения диалога

// Получаем сессии с сервера
const fetchSessions = async () => {
  try {
    const response = await api.getSessions(currentPage.value);

    // Проверяем, массив ли это строк, чтобы избежать ошибок
    if (Array.isArray(response.sessions) && response.sessions.every(s => typeof s === 'string')) {
      sessions.value = response.sessions;
      totalPages.value = Math.ceil(response.sessions.length / 5);
    } else {
      console.error('Ошибка: ожидается массив строк, но получено:', response.sessions);
    }
  } catch (error) {
    console.error('Ошибка при загрузке списка сессий:', error);
  }
};

// Открыть управление сессией
const openSession = (session: string) => {
  selectedSession.value = session;
  isDialogOpen.value = true;
};

// Закрыть управление сессией
const closeSession = () => {
  selectedSession.value = null;
  isDialogOpen.value = false;
};

// Загружаем сессии при монтировании
onMounted(() => {
  fetchSessions();
});
</script>

<template>
  <div class="q-py-md">
    <div v-for="session in sessions.slice((currentPage - 1) * 5, currentPage * 5)" :key="session" class="q-pa-md" style="min-width: 300px; max-width: 350px;">
      <q-card>
        <q-card-section>
          <p class="q-mb-xs text-center">Сессия: {{ session }}</p>
        </q-card-section>

        <q-card-actions class="q-mt-auto" align="center">
          <q-btn label="УПРАВЛЯТЬ" color="secondary" @click="openSession(session)" />
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <div class="c">
    <q-pagination
      v-model="currentPage"
      :max="totalPages"
      class="q-mt-md flex justify-center"
      direction-links
    />
  </div>

  <q-dialog v-model="isDialogOpen">
    <ManageSession v-if="selectedSession" :sessionName="selectedSession" @close="closeSession" />
  </q-dialog>
</template>

<style scoped>
.q-mt-md {
  margin-top: 20px;
}
</style>
