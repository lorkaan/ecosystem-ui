<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  question: any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit("update:modelValue", value || null)
}
</script>

<template>
  <input
    type="date"
    :value="modelValue ?? ''"
    :min="question.schema?.min"
    :max="question.schema?.max"
    @input="onInput"
  />
</template>