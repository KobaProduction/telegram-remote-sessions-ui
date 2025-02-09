<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number] as const,
    required: true
  },
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  hint: String,
})

const emit = defineEmits(['update:modelValue'])
const isFocused = ref(false)

const inputValue = ref(props.modelValue)

watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const showHint = computed(() => isFocused.value && props.hint)
</script>

<template>
  <q-input
    v-model="inputValue"
    :label="label"
    :hint="showHint ? props.hint : ''"
    outlined
    @focus="isFocused = true"
    @blur="isFocused = false"
    hide-bottom-space
    color="amber"
  />
</template>

<style scoped>
</style>
