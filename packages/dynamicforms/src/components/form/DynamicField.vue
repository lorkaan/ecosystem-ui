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
  <div class="form-field">
    <label class="form-label">
      {{ question?.label }}
      <span v-if="question?.required" class="required">*</span>
    </label>

    <div class="form-control">
      <component
        :is="component"
        :question="question"
        :modelValue="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
<style>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151; /* neutral gray */
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-control {
  display: flex;
  align-items: center;
}

/* Apply styling to inputs inside dynamic components */
.form-control :deep(input),
.form-control :deep(select),
.form-control :deep(textarea) {
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #fff;
}

/* Focus state */
.form-control :deep(input:focus),
.form-control :deep(select:focus),
.form-control :deep(textarea:focus) {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

/* Disabled */
.form-control :deep(input:disabled),
.form-control :deep(select:disabled) {
  background: #f3f4f6;
  cursor: not-allowed;
}

/* Inline range fields (like date ranges) */
.form-control :deep(.range-group) {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>