<script setup lang="ts">
import { onMounted, ref, watch } from "vue";


import QueryTabs from "../components/QueryTabs.vue";
import QueryParameters from "../components/QueryParameters.vue";
import { ColumnSelector, GenericDataTable} from "@ecosystem/core-ui";
import type { SavedQuery } from "../types/storedQuery.js";
import { useStoredQueries } from "../composables/useStoredQueries.js";

/* --------------------
   State / Composable
-------------------- */
const {
  queries,
  activeId,
  results,
  resultsLoading,
  allFields,
  selectedFields,
  paramValues,
  paramErrors,

  activeQuery,
  queryParams,
  getFieldLabel,
  prettifyFieldData,

  loadQueries,
  resetParams,
  runActiveQuery,
  //downloadActiveQuery,
  setSelectedFields,
} = useStoredQueries();

const loading = ref(true);
const error = ref("");
const showFilters = ref(false);
const idExists = ref(false);

/* --------------------
   Lifecycle
-------------------- */
onMounted(async () => {
  try {
    await loadQueries();

    const first = Object.values(queries.value)[0] as SavedQuery | undefined;
    if (first) {
      activeId.value = first.id;
      resetParams(first);
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

/* --------------------
   Actions
-------------------- */
function selectTab(id: number | string) {
  activeId.value = id;
  showFilters.value = false;
  resetParams(activeQuery());
}

/* Handle param updates */
function updateParam(name: string, value: any) {
  paramValues.value[name] = value;
}

/* Detect if ID exists (for row clickability) */
function updateIdExists() {
  if (results.value.length > 0) {
    const first = results.value[0];
    idExists.value = !!first && Object.keys(first).includes("id");
  } else {
    idExists.value = false;
  }
}

/* Watch results to detect id field */
watch(results, updateIdExists, { immediate: true });

/* Placeholder navigation handler (you said ignore for now) */
function navToEditPage(row: Record<string, any>) {
  console.log("Row clicked:", row);
}
</script>

<template>
  <div class="dashboard">
    <!-- Loading -->
    <p v-if="loading">Loading queries…</p>

    <!-- Error -->
    <p v-else-if="error" class="error">{{ error }}</p>

    <!-- Tabs -->
    <QueryTabs
      v-else
      :queries="queries"
      :activeId="activeId"
      @select="selectTab"
    />

    <!-- Content -->
    <div v-if="activeId" class="content">
      <h2>{{ activeQuery()?.name }}</h2>
      <p>{{ activeQuery()?.description }}</p>

      <!-- Toggle Filters -->
      <button class="btn-primary" @click="showFilters = !showFilters">
        {{ showFilters ? "Hide Filters" : "Show Filters" }}
      </button>

      <!-- Parameters -->
      <div v-if="showFilters">
        <QueryParameters
          :params="queryParams()"
          :values="paramValues"
          :errors="paramErrors"
          @update:value="updateParam"
          @run="runActiveQuery"
          @download="downloadActiveQuery"
        />
      </div>

      <!-- Loading Results -->
      <div v-if="resultsLoading">Loading results…</div>

      <!-- Column Selector -->
      <ColumnSelector
        :availableColumns="allFields"
        :selectedColumns="selectedFields"
        :getColumnLabel="getFieldLabel"
        @update:selectedColumns="setSelectedFields"
      />

      <!-- Results Table -->
      <GenericDataTable
        :rows="results"
        :columns="selectedFields"
        :getColumnLabel="getFieldLabel"
        :formatValue="prettifyFieldData"
        :clickable="idExists"
        @update:selectedFields="setSelectedFields"
        @rowClick="navToEditPage"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
}

.content {
  padding: 1rem;
  background: #fafafa;
  border-radius: 6px;
}

.error {
  color: red;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1e40af;
}
</style>