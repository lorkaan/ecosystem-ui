<script setup lang="ts">
import type { SavedQuery } from "../types/storedQuery";

interface Props {
  queries: Record<string | number, SavedQuery>;
  activeId: string | number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "select", id: string | number): void;
}>();

function onSelect(id: string | number) {
  emit("select", id);
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="q in props.queries"
      :key="q.id"
      class="tab"
      :class="{ active: q.id === props.activeId }"
      @click="onSelect(q.id)"
    >
      {{ q.name }}
      <span v-if="q.is_system" class="system">★</span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.tab {
  padding: 0.6rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.tab.active {
  border-bottom-color: #42b983;
  color: #42b983;
}

.system {
  margin-left: 4px;
  color: gold;
}
</style>