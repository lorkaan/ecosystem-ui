
<script setup lang="ts">
    import { FormType } from '../../types/form_type';
    import DynamicForm from './DynamicForm.vue';
    import { useFormAnswers } from '../../composables/useFormAnswerStorage';

    const props = defineProps<{
        formType: FormType,
        submit: (payload: any) => void
    }>();

    
    const {
        loading,
        error,
        FormSections,
        clone,
        resetError,
        getQuestionMetaData
    } = useFormAnswers(props.formType);

    /** Added the Answers for the Payload. */
    function createPayloadAnswers(){
        return FormSections.nodes;
    }

    /** Create a Payload that can be understood by the backend. */
    function createPayload(){
        return {
            form_type: props.formType?.id,
            answers: createPayloadAnswers()
        }
    }

    /** Needs to change along with the useForm() composable, which should be changed to be the specific backend interface of Forms */
    function submitFormToBackend(){
        const payload = createPayload();
        props.submit(payload);
    }
    

</script>

<template>
    <div v-if="loading">Loading Form Data...</div>
    <div v-else-if="error" class="errorDiv">
        {{ error }}
    </div>
    <DynamicForm
        v-else
        :sections="FormSections"
        :getQuestionMetaData="getQuestionMetaData"
        @submit="submitFormToBackend"
    />
</template>
<style>

</style>