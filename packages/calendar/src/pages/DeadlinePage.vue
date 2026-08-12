<script setup lang="ts">
import { onMounted, ref } from "vue";

import { DynamicFilter, ColumnSelector, GenericDataTable } from "@ecosystem/core-ui";

import { useGenericQueries } from "@ecosystem/api-client";
import { DeadlineApiHandler } from "../api/ScheduleApiHandler";
import { DeadlineQueryItem } from "../types/deadline";

const {
  results,
  resultsLoading,
  allFields,
  selectedFields,
  getFieldLabel,
  prettifyFieldData,
  loadResults,
  loadFilterSchema,
  setSelectedFields,
} = useGenericQueries<DeadlineQueryItem>(DeadlineApiHandler);

/* -------------------- */
const filterSchema = ref<any | null>(null);
const filterValues = ref<Record<string, any>>({});

/* -------------------- */
onMounted(async () => {
  filterSchema.value = await loadFilterSchema();
});

/* -------------------- */
function updateFilters(params: Record<string, any>) {
  filterValues.value = params;
}

/* -------------------- */
async function runQuery() {
  await loadResults(filterValues.value);
}
</script>

<template>
  <div class="dashboard">
    <h2>Deadlines</h2>

    <!-- Filters -->
    <DynamicFilter
      v-if="filterSchema"
      :schema="filterSchema"
      @update:filters="updateFilters"
    />

    <button class="btn-primary" @click="runQuery">
      Run
    </button>

    <!-- Loading -->
    <div v-if="resultsLoading">Loading results…</div>

    <!-- Column selector -->
    <ColumnSelector
      :availableColumns="allFields"
      :selectedColumns="selectedFields"
      :getColumnLabel="getFieldLabel"
      @update:selectedColumns="setSelectedFields"
    />

    <!-- Table -->
    <GenericDataTable
      :rows="results"
      :columns="selectedFields"
      :getColumnLabel="getFieldLabel"
      :formatValue="prettifyFieldData"
    />
  </div>
</template>