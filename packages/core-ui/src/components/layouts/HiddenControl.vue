<script setup lang="ts">
import { ref } from "vue"

const show = ref(false)
const toggle = () => (show.value = !show.value)
</script>

<template>
  <div class="toggle-container">
    <!-- Header / Toggle Button -->
    <div class="toggle-header">
      <button class="toggle-button" @click="toggle">
        <span>{{ show ? "Hide" : "Show" }}</span>
        <span class="chevron" :class="{ open: show }">▾</span>
      </button>
    </div>

    <!-- Toggleable slot -->
    <transition name="fade">
      <div v-if="show" class="toggle-content">
        <slot name="toggleable" />
      </div>
    </transition>

    <!-- Always visible slot -->
    <div class="always-content">
      <slot name="always" />
    </div>
  </div>
</template>
<style>
.toggle-container {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Header */
.toggle-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

/* Button */
.toggle-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.toggle-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* Chevron animation */
.chevron {
  display: inline-block;
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Toggle content */
.toggle-content {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* Always visible section */
.always-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>