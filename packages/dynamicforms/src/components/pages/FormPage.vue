<script setup lang="ts">
import { onMounted } from "vue"
import { useForm } from "../../composables/useForm"
import DynamicForm from "../form/DynamicForm.vue"

const {
  form,
  answers,
  loadForm,
  submit,
  loading,
  error
} = useForm();

const props = defineProps<{
  formTypeCode: string
}>()

onMounted(() => {
  loadForm(props.formTypeCode)
})
</script>

<template>
  <div v-if="loading">Loading...</div>

  <div v-else-if="error">
    {{ error }}
  </div>

  <DynamicForm
    v-else-if="form"
    :form="form"
    :answers="answers"
    @submit="submit"
  />
</template>