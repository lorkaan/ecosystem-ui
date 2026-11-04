<script setup lang="ts">
import { computed, ref } from "vue";
import { FormGroupInstance, FormSectionData } from "../../storage/formDataStorage.js";
import { FormQuestion, FormType } from "../../types/form_type.js";
import DynamicFormGroupWrapper from './DynamicFormGroupWrapper.vue';
import { RegistryTree, TreeNode } from "../../objs/tree.js";
import { useFormAnswers } from '../../composables/useFormAnswerStorage';


const props = defineProps<{
  formType: FormType,
  sections: FormSectionData,
  getQuestionMetaData: (p: string | number) => FormQuestion | null
}>()

const emit = defineEmits(["submit"])

const curIndex= ref(props.sections.order.length > 0? 0: -1);

function getCurrentTreeNode(): TreeNode<FormGroupInstance>[]{
  if(curIndex.value >= 0 && curIndex.value < props.sections.order.length){
    const regTree: RegistryTree<FormGroupInstance>[] = props.sections.nodes[props.sections.order[curIndex.value]] || [];
    let rootList: TreeNode<FormGroupInstance>[] = [];
    for(let i = 0; i < regTree.length; i++){
      let curRoot: TreeNode<FormGroupInstance> | null = regTree[i].root;
      if(curRoot != null){
        rootList.push(curRoot);
      }else{
        continue;
      }
    }
    return rootList;
  }else{
    return [];
  }
}

const currentRootNodes = computed(getCurrentTreeNode);

/**

export interface FormSectionData{
    order: (string | number)[];  // This is the order for the sections
    nodes: Record<string | number, RegistryTree<FormGroupInstance>[]>; // These are lists of Trees representing the different FormGroup for each section
    metadata: Record<string | number, FormSectionMetadata>;  // This is the metadata for each section (including things like title)
}

 */


/** Runs the Submit functionality that does the intergration with the backend */
const submit = () => {
    emit("submit")
}

function nextSection(){
  curIndex.value = curIndex.value + 1;
}

function gotToSubmit(): boolean{
  return curIndex.value >= (props.sections.order.length - 1);
}

function goToReviewStep(): boolean{
  return false;
}

const {
        FormSections,
        clone,
        resetError,
        getQuestionMetaData
    } = useFormAnswers(props.formType);

    /** Added the Answers for the Payload. */
    function createPayloadAnswers(){
        return {};
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
        submit()
    }

</script>

<template>
  <div class="form-container">

    <!-- Fields -->
    <div class="form-body">
      <DynamicFormGroupWrapper
        v-for="root in currentRootNodes"
        :node="root"
        :getQuestionMetaData="props.getQuestionMetaData"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button v-if="goToReviewStep()" class="btn-primary" @click="nextSection">
        Review
      </button>
      <button v-else-if="gotToSubmit()" class="btn-primary" @click="submit">
        Submit
      </button>
      <button v-else class="btn-primary" @click="nextSection">
        Next
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