<script setup lang="ts">
import { computed } from "vue"
import type { DateTimeRange } from "../../../types/datetimerange";



const props = defineProps<{
  modelValue: DateTimeRange | null
  question: any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: DateTimeRange | null): void
}>()

const value = computed<DateTimeRange>({
  get() {
    return props.modelValue || { start: null, end: null }
  },
  set(val) {
    emit("update:modelValue", val)
  }
})

/**
 * HTML datetime-local expects:
 * YYYY-MM-DDTHH:mm
 * (no timezone)
 */
const formatForInput = (v: string | null) => {
  if (!v) return ""
  return v.slice(0, 16) // trims seconds + timezone if present
}

const updateStart = (e: Event) => {
  const v = (e.target as HTMLInputElement).value || null
  value.value = { ...value.value, start: v }
}

const updateEnd = (e: Event) => {
  const v = (e.target as HTMLInputElement).value || null
  value.value = { ...value.value, end: v }
}
</script>

<template>
  <div style="display: flex; gap: 0.5rem; align-items: center;">
    <input
      type="datetime-local"
      :value="formatForInput(value.start)"
      @input="updateStart"
    />

    <span>to</span>

    <input
      type="datetime-local"
      :value="formatForInput(value.end)"
      @input="updateEnd"
    />
  </div>
</template>