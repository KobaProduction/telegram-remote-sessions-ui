<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number] as const,
    required: true
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  hint: String
})

const emit = defineEmits(['update:modelValue'])
const isFocused = ref(false)

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})

watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const showHint = computed(() => isFocused.value && props.hint)
</script>

<template>
  <div class="q-mb-sm">
    <q-input
      v-model="inputValue"
      :label="label"
      outlined
      @focus="isFocused = true"
      @blur="isFocused = false"
      color="secondary"
      class="q-mb-sm"
    />
    <transition name="hint-fade">
      <div v-if="showHint" class="q-mt-sm text-body2">{{ props.hint }}</div>
    </transition>
  </div>
</template>

<style scoped>
.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.5s;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}
</style>
