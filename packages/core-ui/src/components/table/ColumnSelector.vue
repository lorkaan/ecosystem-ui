<script setup lang="ts">

interface Props {
  availableColumns: string[];
  selectedColumns: string[];
  getColumnLabel?: (column: string) => string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    getColumnLabel: (column: string) => column,
  }
);


const emit = defineEmits<{
  (
    e: "update:selectedColumns",
    value: string[]
  ): void;
}>();


function toggleColumn(column: string) {

  const next = [...props.selectedColumns];

  const index = next.indexOf(column);

  if (index === -1) {
    next.push(column);
  } else {
    next.splice(index, 1);
  }

  emit(
    "update:selectedColumns",
    next
  );
}


function label(column: string) {
  return props.getColumnLabel(column);
}

</script>


<template>

  <div
    v-if="availableColumns.length"
    class="column-controls"
  >

    <h3>
      Columns
    </h3>


    <div class="column-list">

      <label
        v-for="column in availableColumns"
        :key="column"
        class="column-item"
      >

        <input
          type="checkbox"
          :checked="selectedColumns.includes(column)"
          @change="toggleColumn(column)"
        />

        {{ label(column) }}

      </label>

    </div>

  </div>

</template>


<style scoped>

.column-controls {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
}


.column-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}


.column-item {
  font-size: 0.9rem;
}

</style>