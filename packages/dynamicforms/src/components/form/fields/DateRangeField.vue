<script setup lang="ts">
import { computed } from "vue"

type DateRange = {
  start: string | null
  end: string | null
}

const props = defineProps<{
  modelValue: DateRange | null
  question: any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: DateRange | null): void
}>()

const value = computed<DateRange>({
  get() {
    return props.modelValue || { start: null, end: null }
  },
  set(val) {
    emit("update:modelValue", val)
  }
})

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
  <div style="display: flex; gap: 0.5rem;">
    <input
      type="date"
      :value="value.start ?? ''"
      @input="updateStart"
    />

    <span>to</span>

    <input
      type="date"
      :value="value.end ?? ''"
      @input="updateEnd"
    />
  </div>
</template>