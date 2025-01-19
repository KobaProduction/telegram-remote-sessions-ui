<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/services/trsApiInstance';
import { useQuasar } from 'quasar';
import type { ApiResponse } from 'src/services/trsApiTypes';

const name = ref('test');
const appVersion = ref('test');
const langCode = ref('test');
const deviceModel = ref('test');
const systemVersion = ref('test');
const systemLangCode = ref('test');
const apiId = ref(1);
const apiHash = ref('test');


const isDialogOpen = ref(false);


const $q = useQuasar();


const router = useRouter();




const openDialog = () => {
  isDialogOpen.value = true;
};


const closeDialog = () => {
  isDialogOpen.value = false;
};


const createNewSession = async () => {
  try {

    const response = await api.createSession({
      name: name.value,
      app_version: appVersion.value,
      lang_code: langCode.value,
      device_model: deviceModel.value,
      system_version: systemVersion.value,
      system_lang_code: systemLangCode.value,
      api_id: apiId.value,
      api_hash: apiHash.value,
    }) as ApiResponse; // Приводим response к типу ApiResponse

    // Проверка на успешность создания сессии
    if (response.status === 'success') {
      $q.notify({
        color: 'positive',
        message: 'Сессия успешно создана!',
        position: 'top',
      });
      closeDialog();


      await router.push('/sessions');
    } else {

      $q.notify({
        color: 'negative',
        message: `Ошибка: ${response.message || 'Неизвестная ошибка'}`,
        position: 'top',
      });
    }
  } catch (error: unknown) {

    if (error instanceof Error) {
      $q.notify({
        color: 'negative',
        message: `Ошибка при создании сессии: ${error.message}`,
        position: 'top',
      });
    } else {
      $q.notify({
        color: 'negative',
        message: 'Неизвестная ошибка при создании сессии.',
        position: 'top',
      });
    }
  }
};

</script>

<template>
  <div class="col self-center q-pa-md">

    <q-btn
      @click="openDialog"
      color="primary"
      label="Создать сессию"
      class="q-mt-md"
    />

    <!-- Модальное окно для ввода данных сессии -->
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <h6>Создать новую сессию</h6>
          <!-- Форма для ввода данных сессии -->
          <q-input
            v-model="name"
            label="Название сессии"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="appVersion"
            label="Версия приложения"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="langCode"
            label="Язык"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="deviceModel"
            label="Модель устройства"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="systemVersion"
            label="Версия системы"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="systemLangCode"
            label="Язык системы"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
          <q-input
            v-model="apiId"
            label="API ID"
            outlined
            :rules="[val => val && !isNaN(val) || 'API ID должен быть числом']"
          />
          <q-input
            v-model="apiHash"
            label="API Hash"
            outlined
            :rules="[val => val && val.length > 0 || 'Это поле обязательно']"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Отмена" color="negative" @click="closeDialog" />
          <q-btn
            label="Создать"
            color="primary"
            @click="createNewSession"
            :disable="!name || !appVersion || !langCode || !deviceModel || !systemVersion || !systemLangCode || !apiId || !apiHash"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
