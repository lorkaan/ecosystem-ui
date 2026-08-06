<script setup lang="ts">
import draggable from "vuedraggable";

type Row = Record<string, any>;

interface Props {
  rows: Row[];
  columns: string[];

  getColumnLabel?: (column: string) => string;
  formatValue?: (value: any, column: string, row: Row) => any;

  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  getColumnLabel: (column: string) => column,
  formatValue: (value: any) => value,
  clickable: false,
});


const emit = defineEmits<{
  (
    e: "rowClick",
    row: Row
  ): void;

  (
    e: "update:columns",
    columns: string[]
  ): void;
}>();


function updateColumns(value: string[]) {
  emit("update:columns", value);
}


function handleRowClick(row: Row) {
  if(props.clickable){
    emit("rowClick", row);
  }
}
</script>


<template>
  <table
    v-if="rows.length"
    class="results-table"
  >

    <thead>
      <draggable
        :model-value="columns"
        tag="tr"
        item-key="column"
        @update:model-value="updateColumns"
      >
        <template #item="{ element }">
          <th>
            {{ getColumnLabel(element) }}
          </th>
        </template>
      </draggable>
    </thead>


    <tbody>

      <tr
        v-for="(row, index) in rows"
        :key="index"
        :class="{
          'table-row-active': clickable
        }"
        @click="handleRowClick(row)"
      >

        <td
          v-for="column in columns"
          :key="column"
        >
          {{ formatValue(row[column], column, row) }}
        </td>

      </tr>

    </tbody>

  </table>

  <p v-else>
    No results
  </p>
</template>


<style scoped>

.results-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  font-size: 0.95rem;
}


.results-table th,
.results-table td {
  text-align: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
}


.results-table th {
  white-space: nowrap;
  font-weight: 600;
}


.table-row-active:hover {
  cursor: pointer;
}

</style>