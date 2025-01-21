<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { TrsApi } from 'src/services/trs/api'

const props = defineProps<{
  api: TrsApi;
}>();

const name = ref('test');
const appVersion = ref('test');
const langCode = ref('test');
const deviceModel = ref('test');
const systemVersion = ref('test');
const systemLangCode = ref('test');
const apiId = ref(1);
const apiHash = ref('test');

const isDialogOpen = ref(false);


const router = useRouter();

const openDialog = () => {
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
};


const createNewSession = async () => {
  try {
    console.log('Отправляем запрос на создание сессии...');
    const result = await props.api.createSession(name.value, {
      app_version: appVersion.value,
      lang_code: langCode.value,
      device_model: deviceModel.value,
      system_version: systemVersion.value,
      system_lang_code: systemLangCode.value,
      api_id: apiId.value,
      api_hash: apiHash.value,
    });

    console.log('Ответ от сервера:', result);
    if (result.status) {
      console.log('Сессия успешно создана!');

      closeDialog();
      await router.push('/sessions');
    } else if (result.message.includes('Session already exist')) {
      console.log('Ошибка: Сессия уже существует');

    } else {
      console.log('Ошибка от сервера:', result.message);
    }
  } catch (error) {
    console.error('Ошибка при создании сессии:', error)
  }
}
</script>

<template>
  <div class="col self-center q-pa-md">
    <q-btn
      @click="openDialog"
      color="primary"
      label="Создать сессию"
      class="q-mt-md"
    />

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <h6>Создать новую сессию</h6>
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
