import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { parseUser, type User } from './types/user.ts';
import { BasicAuthApiHandler, createAuthStore, AUTH_STORE_KEY } from "@ecosystem/auth";
import router from './router/index.ts';

const app = createApp(App);

const authStore = createAuthStore<User>(
  BasicAuthApiHandler,
  parseUser
);

app.provide(AUTH_STORE_KEY, authStore);

app.use(router)

app.mount("#app");