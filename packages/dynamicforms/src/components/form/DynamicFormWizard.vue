
<script setup lang="ts">
    import { onMounted } from 'vue';
import { useFormBackend } from '../../composables/useFormBackend';
    import DynamicFormWrapper from './DynamicFormWrapper.vue';

    const props = defineProps<{
        formTypeCode: string,
    }>();

    const {
        FormType_loading,
        FormType_error,
        FormType_submitting,
        FormType,
        load,
        submit
    } = useFormBackend();  // Depreciated

    
    onMounted(() => {
        load(props.formTypeCode)
    })
</script>

<template>
    <div v-if="FormType_loading">Loading Form Data...</div>
    <div v-else-if="FormType_error" class="errorDiv">
        {{ FormType_error }}
    </div>
    <div v-else-if="FormType" class="form-container">
        <!-- Header -->
        <div class="form-header">
            <h2 class="form-title">{{ FormType.name }}</h2>
            <p v-if="FormType.description" class="form-description">
            {{ FormType.description }}
            </p>
        </div>
        <DynamicFormWrapper
            :formType="FormType"
            :submit="submit"
        />
    </div>
    <div v-else class="errorDiv">
        Unknown Error: Can not get the FormType on Client Side
    </div>
</template>
<style>

</style>