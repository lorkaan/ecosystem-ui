import { ref, reactive } from "vue"
import {
  DynamicFormInstanceApiHandler,
  DynamicFormTypeApiHandler
} from "../api/DynamicFormApiHandler"
import type { FormType } from "../types/form_type"
import type { AnswerPayload } from "../types/answer_payload"

export function useForm() {
  const form = ref<FormType | null>(null)
  const instanceId = ref<string | null>(null)

  const answers = reactive<Record<string, any>>({})

  const loading = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)

  // -------------------------
  // LOAD FORM TYPE
  // -------------------------
  const loadForm = async (code: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await DynamicFormTypeApiHandler.get_latest(code);
      const data = await res.json()

      form.value = data

      Object.keys(answers).forEach(k => delete answers[k])

      form?.value?.questions.forEach((q) => {
        answers[q.id] = null
      })

    } catch (err: any) {
      error.value = err?.message || "Failed to load form"
    } finally {
      loading.value = false
    }
  }

  // -------------------------
  // BUILD ANSWERS
  // -------------------------
  const buildAnswersPayload = (): AnswerPayload[] => {
    return Object.entries(answers).map(([question, value]) => ({
      question,
      value,
    }))
  }

  // -------------------------
  // CREATE / UPDATE DRAFT
  // -------------------------
  const saveDraft = async () => {
    if (!form.value) return

    loading.value = true
    error.value = null

    try {
      const payload = {
        form_type: form.value.id,
        answers: buildAnswersPayload(),
      }

      if (!instanceId.value) {
        const res = await DynamicFormInstanceApiHandler.create(payload)
        const data = await res.json()

        instanceId.value = data.id
      } else {
        await DynamicFormInstanceApiHandler.update(
          instanceId.value,
          payload
        )
      }

    } catch (err: any) {
      error.value = err?.message || "Failed to save draft"
      throw err
    } finally {
      loading.value = false
    }
  }

  // -------------------------
  // SUBMIT
  // -------------------------
  const submit = async () => {
    if (!instanceId.value) {
      await saveDraft()
    }

    submitting.value = true
    error.value = null

    try {
      await DynamicFormInstanceApiHandler.submit(instanceId.value!)
    } catch (err: any) {
      error.value = err?.message || "Submission failed"
      throw err
    } finally {
      submitting.value = false
    }
  }

  // -------------------------
  // LOAD INSTANCE
  // -------------------------
  const loadInstance = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await DynamicFormInstanceApiHandler.getById(id)
      const data = await res.json()

      instanceId.value = data.id

      Object.keys(answers).forEach(k => delete answers[k])

      data.answers.forEach((a: any) => {
        answers[a.question] = a.value
      })

    } catch (err: any) {
      error.value = err?.message || "Failed to load instance"
    } finally {
      loading.value = false
    }
  }

  // -------------------------
  // RESET
  // -------------------------
  const reset = () => {
    form.value = null
    instanceId.value = null

    Object.keys(answers).forEach(k => delete answers[k])

    error.value = null
  }

  return {
    form,
    answers,
    instanceId,

    loading,
    submitting,
    error,

    loadForm,
    loadInstance,
    saveDraft,
    submit,
    reset,
  }
}