<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  modelValue: string | null
  question: any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const value = computed<string | null>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val)
  }
})

/**
 * HTML datetime-local expects:
 * YYYY-MM-DDTHH:mm
 */
const formatForInput = (v: string | null) => {
  if (!v) return ""
  return v.slice(0, 16)
}

const updateValue = (e: Event) => {
  const v = (e.target as HTMLInputElement).value || null
  value.value = v
}
</script>

<template>
  <input
    type="datetime-local"
    :value="formatForInput(value)"
    @input="updateValue"
  />
</template>