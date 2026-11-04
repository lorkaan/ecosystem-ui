<script setup lang="ts">
import { computed } from "vue";
import DynamicFormWizard from "../form/DynamicFormWizard.vue"


import { useRoute } from 'vue-router';

const route = useRoute();

const formTypeCode = computed(() => route.params.formTypeCode as string);

</script>

<template>
  <DynamicFormWizard
    :formTypeCode="formTypeCode"
  />
</template>