<script setup lang="ts">
import type { Answers } from "../../types/answers.js";
import type { FormType } from "../../types/form_type.js";
import DynamicField from "./DynamicField.vue"


const props = defineProps<{
  form: FormType | null
  answers: Answers
}>()

const emit = defineEmits(["submit"])

const submit = () => {
  const payload = {
    form_type: props.form?.id,
    answers: Object.entries(props.answers || {}).map(
      ([question, value]) => ({
        question,
        value
      })
    )
  }

  emit("submit", payload)
}
</script>

<template>
  <div v-if="form" class="form-container">
    <!-- Header -->
    <div class="form-header">
      <h2 class="form-title">{{ form.name }}</h2>
      <p v-if="form.description" class="form-description">
        {{ form.description }}
      </p>
    </div>

    <!-- Fields -->
    <div class="form-body">
      <DynamicField
        v-for="q in form.questions"
        :key="q.id"
        :question="q"
        v-model="answers[q.id]"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button class="btn-primary" @click="submit">
        Submit
      </button>
    </div>
  </div>
</template>
<style>
.form-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Header */
.form-header {
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #111827;
}

.form-description {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Body */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Actions */
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

/* Button */
.btn-primary {
  padding: 0.55rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-primary:active {
  background: #1e40af;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}
</style>