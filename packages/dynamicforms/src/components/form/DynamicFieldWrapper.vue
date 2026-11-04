<script setup lang="ts">
import { FormGroupInstance } from '../../storage/formDataStorage';
import { AnswerValue } from '../../types/form_answers';
import { FormQuestion } from '../../types/form_type';
import DynamicField from "./DynamicField.vue"

/** For Reference, the Interfaces are:

interface FormAnswerInstance{
    question_id: string | number;
    answer_value: any;
}

export interface FormGroupInstance extends IdData{
    type_id: string | number;   // This is the ID of the FormGroup Metadata
    answers: FormAnswerInstance[];
}
    
*/


const props = defineProps<{
    question: FormQuestion | null,
    modelValue: AnswerValue,
}>()

</script>
<template>
    <div v-if="props.question != null">
        <DynamicField
            :key="props.question?.id"
            :question="props.question"
            v-model="modelValue"
        />
    </div>

</template>
<style></style>