<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Array],
  question: Object
})

const emit = defineEmits(["update:modelValue"])

const options = props.question?.options || []

function handleChange(e: Event) {
  const target = e.target as HTMLSelectElement

  if (target.multiple) {
    const values = Array.from(target.selectedOptions).map(o => o.value)
    emit("update:modelValue", values)
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>

<template>
  <select
    :multiple="question?.schema?.multiple"
    @change="handleChange"
  >
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>