<script setup lang="ts">
import { Answers } from "../../types/answers.js";
import { FormType } from "../../types/form_type.js";
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
  <div v-if="form">
    <h2>{{ form.name }}</h2>

    <div v-for="q in form.questions" :key="q.id">
      <label>
        {{ q.label }}
        <span v-if="q.required">*</span>
      </label>

      <DynamicField
        :question="q"
        v-model="answers[q.id]" 
      />
    </div>

    <button @click="submit">Submit</button>
  </div>
</template>