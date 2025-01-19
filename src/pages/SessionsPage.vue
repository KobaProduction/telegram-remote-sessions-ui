<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSessions } from 'src/services/sessionsService';
import SessionList from 'components/SessionList.vue';
import CreateSessionButton from 'components/button/CreateSessionButton.vue';

const sessions = ref([]);
const currentPage = ref(1);
// const connectedServerAPI = ref(null);
const totalSessions = ref(0);
const sessionsPerPage = 5; // Количество сессий на странице

const fetchSessions = async () => {
  try {
    const data = await getSessions(currentPage.value, sessionsPerPage);
    sessions.value = data.sessions;
    totalSessions.value = data.total;
  } catch (error) {
    console.error('Ошибка при загрузке сессий:', error);
  }
};

// const onConnect = async () =>{
//   // получаем последний url сервера
//   const serverAPI = new TRSAPI("http://localhost:5000");
//   const status = await serverAPI.getStatus()
//   if (status) {
//     rou
//   }
// }
onMounted(() => {
  fetchSessions();
});
</script>

<template>
  <div class="column">
    <!-- Вставляем компонент кнопки создания сессии -->
    <CreateSessionButton />

    <div v-if="sessions.length" class="col self-center">
      <SessionList :sessions="sessions" :totalSessions="totalSessions" :currentPage="currentPage" />
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

<style>

</style>
