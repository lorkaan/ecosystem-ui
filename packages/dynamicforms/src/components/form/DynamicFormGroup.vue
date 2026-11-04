<script setup lang="ts">
import { FormGroupInstance } from '../../storage/formDataStorage';
import { FormQuestion } from '../../types/form_type';
import DynamicFieldWrapper from "./DynamicFieldWrapper.vue"

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
    groupInstance: FormGroupInstance,
    getQuestionMetaData: (p: string | number) => FormQuestion | null
}>()

</script>
<template>
    <div class="form-body">
        <DynamicFieldWrapper
            v-for="q in props.groupInstance.answers"
            :key="q.question_id"
            :question="props.getQuestionMetaData(q.question_id)"
            v-model="q.answer_value"
        />
    </div>

</template>
<style></style>