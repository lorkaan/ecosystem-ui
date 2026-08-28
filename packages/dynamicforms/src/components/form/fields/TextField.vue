<!-- TextField.vue -->
<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  question: Object
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>