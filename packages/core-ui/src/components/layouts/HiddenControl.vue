<script setup lang="ts">
import { ref } from "vue"

const show = ref(false)
const toggle = () => (show.value = !show.value)
</script>

<template>
  <button @click="toggle">
    {{ show ? "Hide" : "Show" }}
  </button>

  <!-- Toggleable slot -->
  <div v-if="show">
    <slot name="toggleable" />
  </div>

  <!-- Always visible slot -->
  <div>
    <slot name="always" />
  </div>
</template>