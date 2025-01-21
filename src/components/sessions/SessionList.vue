<script setup lang="ts">
import { ref } from 'vue'
import ManageSession from 'components/sessions/ManageSession.vue';
import type { TrsApi } from 'src/services/trs/api'


const props = defineProps<{
  sessions: string[];
  api: TrsApi;
}>();

const sessionsPerPage = 5;
const totalSessions = ref(props.sessions.length);
const totalPages = ref(Math.ceil(totalSessions.value / sessionsPerPage));
const currentPage = ref<number>(1)

const pageSessions = props.sessions.slice((currentPage.value - 1) * sessionsPerPage, currentPage.value * sessionsPerPage)

const selectedSession = ref<string | null>(null);
const isDialogOpen = ref(false);



const openSession = (session: string) => {
  selectedSession.value = session;
  isDialogOpen.value = true;
};

const closeSession = () => {
  selectedSession.value = null;
  isDialogOpen.value = false;
};

</script>

<template>
  <div class="q-py-md">
    <div v-for="session in pageSessions" :key="session" class="temp">
      <q-card class="row">
        <q-card-section>
          <p class="q-ma-none">{{ session }}</p>
        </q-card-section>
        <q-card-section class="q-pa-none q-ml-auto">
          <q-card-actions align="center">
            <q-btn label="УПРАВЛЯТЬ" color="secondary" @click="openSession(session)" />
          </q-card-actions>
        </q-card-section>


      </q-card>
    </div>
  </div>

  <div>
    <q-pagination
      v-if="totalSessions > sessionsPerPage"
      v-model="currentPage"
      :max="totalPages"
      class="q-pa-xs"
    />
  </div>

  <q-dialog v-model="isDialogOpen">
    <ManageSession v-if="selectedSession" :sessionName="selectedSession" :api="props.api" @close="closeSession" />
  </q-dialog>
</template>

<style scoped>
.temp {
  padding: 5px;
  min-width: 300px;
  max-width: 350px;
}
</style>
