<script setup lang="ts">
import { ResetLocalStorageView } from '@/features/reset-app/'
import { ServerDashboardWidget, SelectedServerWidget} from '@/widgets/servers/'
</script>

<template>
  <q-page>
    <ResetLocalStorageView />
    <div class="row">
      <div class="col-12 col-md-6 q-pa-sm">
        <SelectedServerWidget />
      </div>
      <div class="col-12 col-md-6 q-pa-sm">
        <ServerDashboardWidget />
      </div>
    </div>
  </q-page>
</template>
