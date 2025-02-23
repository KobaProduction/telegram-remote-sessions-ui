<script setup lang="ts">
import { ref } from 'vue'
// import { Notify } from 'quasar'
// import { AxiosError } from 'axios'
// import { useServerStore } from '@/entities/servers'
import type { ServerStatuses } from '@/widgets/servers/types/props'
import type { ServerHistoryItem } from '@/entities/servers'

// const serverStore = useServerStore()

const serverStatuses = ref<ServerStatuses>(new Map())

const updateServerErrorMessage = ref<string>('')

interface ServerHistoryItemViewProps {
  id: string
  data: ServerHistoryItem
  isConnected: boolean
  onEdit: (id: string, data: ServerHistoryItem) => void
  onDelete: (id: string) => void
  onConnect: (id: string) => void
}

const props = defineProps<ServerHistoryItemViewProps>()

const editedServerName = ref<string>(props.data.name || '')
const editedServerURL = ref<string>(props.data.url || '')
const editedServerNameError = ref<string>('')
const editedServerUrlError = ref<string>('')

const editing = ref<boolean>(false)


const removeServer = () => {
  // editingIndex.value = serverName
  // editedServerName.value = serverName
  // editedServerURL.value = originalServerUrl
  props.onDelete(props.id)
}

const editServer = () => {
  editing.value = true
  // editingIndex.value = serverName
  // editedServerName.value = serverName
  // editedServerURL.value = originalServerUrl
}

const saveEdit = () => {
  editing.value = false
  props.onEdit(props.id, {url: editedServerURL.value, name: editedServerName.value})
}

</script>

<template>
  <q-item-section class="col">
    <div class="row items-center">
      <q-icon
        :name="props.isConnected ? 'check_circle' : 'cancel'"
        class="q-mr-sm"
        size="sm"
        :color="props.isConnected ? 'positive' : 'negative'"
      />
      <div v-if="editing" class="col q-gutter-y-sm">
        <q-input
          v-model="editedServerName"
          dense
          autofocus
          label="Name"
          :error="!!editedServerNameError"
          :error-message="editedServerNameError"
          class="col"
        />
        <q-input
          v-model="editedServerURL"
          dense
          label="URL"
          :error="!!editedServerUrlError"
          :error-message="editedServerUrlError"
          class="col"
        />
      </div>
      <q-item-label v-else class="col">
        <div class="column">
          <div class="text-bold text-body1">{{ props.data.name }}</div>
          <a
            :href="props.data.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-caption text-grey-7 text-underline"
          >
            {{ props.data.url }}
          </a>
          <p v-if="!serverStatuses.get(props.data.name)" class="text-red text-caption q-mb-none">
            {{ updateServerErrorMessage }}
          </p>
        </div>
      </q-item-label>
    </div>

    <q-item-section side class="q-gutter-xs">
      <q-btn color="secondary" label="Connect" size="sm" @click="props.onConnect(props.id)" class="full-width" />
    </q-item-section>

    <q-item-section side class="q-gutter-xs">
      <q-btn v-if="editing" color="positive" icon="check" @click="saveEdit" size="sm" />
      <q-btn
        v-if="!editing"
        color="warning"
        icon="edit"
        @click="editServer"
        :disable="editing"
        size="sm"
      />
      <q-btn color="negative" icon="delete" @click="removeServer" size="sm" />
    </q-item-section>
  </q-item-section>
</template>
