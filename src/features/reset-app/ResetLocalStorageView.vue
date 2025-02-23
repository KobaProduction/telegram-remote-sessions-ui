<script setup lang="ts">
function clearLocalStorage() {
  localStorage.clear()
}
</script>

<template>
  <q-btn
    @click="clearLocalStorage"
    label="Clear all saved data"
    color="secondary"
    class="full-width"
  />
</template>
