<script setup lang="ts">
import { TreeNode } from '../../objs/tree';
import { FormGroupInstance } from '../../storage/formDataStorage';
import { FormQuestion } from '../../types/form_type';
import DynamicFormGroup from "./DynamicFormGroup.vue"

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
    node: TreeNode<FormGroupInstance>,
    getQuestionMetaData: (p: string | number) => FormQuestion | null
}>()

</script>
<template>
    <div>
        <DynamicFormGroup
            :groupInstance="props.node.data"
            :getQuestionMetaData="getQuestionMetaData"
        />
        <DynamicFormGroupWrapper
            v-for="child of props.node.children"
            :node="child"
            :getQuestionMetaData="getQuestionMetaData"
        />
    </div>

</template>
<style></style>