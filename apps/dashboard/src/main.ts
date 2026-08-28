import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import type { parseUser, type User } from './types/user.ts';
import { BasicAuthApiHandler, createAuthStore, AUTH_STORE_KEY } from "@ecosystem/auth";
import router from './router/index.ts';

console.log("RUNNING MAIN.ts")

const app = createApp(App);

const authStore = createAuthStore<User>(
  BasicAuthApiHandler,
  parseUser
);

app.provide(AUTH_STORE_KEY, authStore);
console.log("PROVIDE KEY", AUTH_STORE_KEY);

app.use(router)

app.mount("#app");