<script setup lang="ts">

import { DynamicInput } from "@ecosystem/core-ui";
import type { ParamDef } from "../types/paramdef";

interface Props {
  params: Record<string, ParamDef>;
  values: Record<string, any>;
  errors: Record<string, string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:value", name: string, value: any): void;
  (e: "run"): void;
  (e: "download"): void;
}>();

function updateValue(name: string, value: any) {
  emit("update:value", name, value);
}

function prettifyField(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/__/g, " → ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
</script>

<template>
  <div v-if="Object.keys(props.params).length" class="params">
    <h3>Parameters</h3>

    <div
      v-for="(def, name) in props.params"
      :key="name"
      class="param"
    >
      <label>
        {{ prettifyField(name) }}
        <span v-if="def.required" class="required">*</span>
      </label>

      <DynamicInput
        :modelValue="props.values[name]"
        @update:modelValue="(val: any) => updateValue(name, val)"
        :type="def.type === 'uuid' ? 'text' : def.type"
      />

      <div v-if="props.errors[name]" class="param-error">
        {{ props.errors[name] }}
      </div>
    </div>

    <button class="run-btn" @click="emit('run')">
      Run Query
    </button>

    <button class="run-btn" @click="emit('download')">
      Download
    </button>
  </div>
</template>

<style scoped>
.params {
  margin: 1rem 0;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.param {
  margin-bottom: 0.75rem;
}

.param label {
  display: block;
  font-weight: 500;
}

.required {
  color: red;
}

.param-error {
  color: red;
  font-size: 0.85rem;
}

.run-btn {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
}
</style>