<script setup lang="ts">
import { ref, onMounted } from "vue"
import { FilterField, FilterOption } from "../types/filterTypes";



const props = defineProps<{
  schema: { filters: FilterField[] }
}>()

const emit = defineEmits<{
  (e: "update:filters", value: Record<string, any>): void
}>()

const values = ref<Record<string, any>>({})
const remoteOptions = ref<Record<string, FilterOption[]>>({})

async function fetchOptions(field: FilterField) {
  if (!field.endpoint) return

  const res = await fetch(field.endpoint)
  const data = await res.json()

  // assume DRF pagination or plain list
  remoteOptions.value[field.name] = data.results || data
}

onMounted(() => {
  props.schema.filters.forEach((f: FilterField) => {
    if (f.type === "relation" && !f.has_inline_options) {
      fetchOptions(f)
    }
  })
})

function updateFilters() {
  const params: Record<string, any> = {}

  for (const key in values.value) {
    const val = values.value[key]
    if (val !== null && val !== "" && val !== undefined) {
      params[key] = val
    }
  }

  emit("update:filters", params)
}
</script>

<template>
  <div class="filter-container">
    <div
      v-for="filter in schema.filters"
      :key="filter.name"
      class="filter-item"
    >
      <label>{{ filter.label }} ({{ filter.lookup_label }})</label>

      <!-- RELATION -->
      <select
        v-if="filter.type === 'relation'"
        v-model="values[filter.name]"
        @change="updateFilters"
      >
        <option value="">-- Select --</option>

        <option
          v-for="opt in (filter.options || remoteOptions[filter.name] || [])"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- BOOLEAN -->
      <select
        v-else-if="filter.type === 'boolean'"
        v-model="values[filter.name]"
        @change="updateFilters"
      >
        <option value="">-- Select --</option>
        <option :value="true">True</option>
        <option :value="false">False</option>
      </select>

      <!-- DATETIME -->
      <input
        v-else-if="filter.type === 'datetime'"
        type="datetime-local"
        v-model="values[filter.name]"
        @change="updateFilters"
      />

      <!-- NUMBER -->
      <input
        v-else-if="filter.type === 'number'"
        type="number"
        v-model="values[filter.name]"
        @input="updateFilters"
      />

      <!-- STRING -->
      <input
        v-else
        type="text"
        v-model="values[filter.name]"
        @input="updateFilters"
      />
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}
</style>