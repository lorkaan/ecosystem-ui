<script setup lang="ts">
const props = defineProps<{
  modelValue: number | null
  question: any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void
}>()

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value

  if (value === "") {
    emit("update:modelValue", null)
    return
  }

  const num = Number(value)

  if (!isNaN(num)) {
    emit("update:modelValue", num)
  }
}
</script>

<template>
  <input
    type="number"
    :value="modelValue ?? ''"
    :min="question.schema?.min"
    :max="question.schema?.max"
    :step="question.schema?.step || 'any'"
    @input="onInput"
  />
</template>