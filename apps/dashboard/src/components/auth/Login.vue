<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@ecosystem/auth";
import type { User } from "../../types/user";

const router = useRouter()

// 🔥 Inject global auth store
const authStore = useAuthStore<User>()

const username = ref("")
const password = ref("")
const error = ref("")

async function submit() {
  error.value = ""

  try {
    await authStore.login(username.value, password.value)

    // optional: you could also check authStore.state.isAuthenticated here
    await router.push("/dashboard")

  } catch (err) {
    console.error(err)
    error.value = "Invalid credentials"
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="login-form">
    <h1>Login</h1>

    <input
      type="text"
      v-model="username"
      placeholder="Username"
      required
    />

    <input
      type="password"
      v-model="password"
      placeholder="Password"
      required
    />

    <button type="submit" :disabled="authStore.state.isLoading">
      {{ authStore.state.isLoading ? "Logging in..." : "Login" }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<style scoped>
.login-form {
  max-width: 360px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error {
  color: red;
}
</style>