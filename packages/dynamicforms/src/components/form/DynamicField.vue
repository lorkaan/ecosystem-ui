<!-- DynamicField.vue -->
<script setup lang="ts">
import { computed } from "vue"
import { useFieldRegistry } from "../../composables/useFieldRegistry"

const props = defineProps({
  question: Object,
  modelValue: [String, Number, Object, Array],
})

const emit = defineEmits(["update:modelValue"])

const { getComponent } = useFieldRegistry()

const component = computed(() =>
  getComponent(props.question?.field_type)
)
</script>

<template>
  <component
    :is="component"
    :question="question"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>