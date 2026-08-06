<script setup lang="ts">
const props = defineProps<{
  modelValue: any
  type?: string
}>()

const emit = defineEmits(['update:modelValue'])

function formatValue(value: any) {

  if (props.type === 'date' && value) {

    const date = new Date(value)

    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10)
    }
  }

  return value ?? ''
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    class="base-input"
    :type="type || 'text'"
    :value="formatValue(modelValue)"
    @input="onInput"
  />
</template>

<style scoped>
.base-input {
  width: 100%;
  padding: 0.75rem 1rem;

  font-size: 0.95rem;
  line-height: 1.4;
  color: #1f2937;

  background-color: #ffffff;

  border: 1px solid #d1d5db;
  border-radius: 10px;

  outline: none;
  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.base-input::placeholder {
  color: #9ca3af;
}

.base-input:hover {
  border-color: #9ca3af;
}

.base-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.base-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>