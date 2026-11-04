<script setup lang="ts">
import { RegistryTree } from '../../objs/tree';
import { FormGroupInstance } from '../../storage/formDataStorage';
import { FormQuestion } from '../../types/form_type';
import DynamicFormGroupWrapper from "./DynamicFormGroupWrapper.vue"

// Depcreciated

const props = defineProps<{
    groups: RegistryTree<FormGroupInstance>[],
    getQuestionMetaData: (p: string | number) => FormQuestion | null
}>()

</script>
<template>
    <div class="form-body">
        <div v-for="g in props.groups">
            <DynamicFormGroupWrapper 
                v-if="g.root != null"
                :getQuestionMetaData="props.getQuestionMetaData"
                :node="g.root"
            />
        </div>
    </div>

</template>
<style></style>