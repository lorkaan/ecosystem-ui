<script setup lang="ts" generic="TUser">
import { useRouter } from "vue-router"
import type { AuthStore } from "@ecosystem/auth"
import { createToolbarLists } from "../types/toolbarItem";
import type { ToolbarAuthLists, ToolbarItem } from "../types/toolbarItem";

const router = useRouter()

const props = defineProps<{
  authStore: AuthStore<TUser>
  toolbarItems: ToolbarItem[],
  homeItem: ToolbarItem,
  loginItem: ToolbarItem,
  logoutLabel: string,
  logoutRedirectPath?: string
}>();

const toolbarLists: ToolbarAuthLists = createToolbarLists(props.toolbarItems);

/* ---------------------------
   Actions
---------------------------- */
function handleLogout() {
  props.authStore.logout().catch((error: unknown)=>{
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error("Unknown error:", error)
    }
  }).then(()=>{
    router.push(props.logoutRedirectPath? props.logoutRedirectPath : props.loginItem.path)
  })
}
</script>

<template>
  <nav class="toolbar">
    <div
      v-if="
        props.homeItem.visibility === 'both' ||
        (
          props.authStore.state.isAuthenticated &&
          props.homeItem.visibility === 'auth'
        ) ||
        (
          !props.authStore.state.isAuthenticated &&
          props.homeItem.visibility === 'unauth'
        )
      "
      class="left"
    >
      <router-link :to="props.homeItem.path">
        {{ props.homeItem.label }}
      </router-link>
    </div>
    
    <div class="right">
      <template v-if="props.authStore.state.isAuthenticated">
        <span v-for="item in toolbarLists.auth" :key="item.path" class="nav-item"><router-link :to="item.path">{{item.label}}</router-link></span>
        <span class="nav-item"><button @click="handleLogout">{{ props.logoutLabel }}</button></span>
      </template>

      <template v-else>
        <span v-for="item in toolbarLists.unauth" :key="item.path" class="nav-item"><router-link :to="item.path">{{item.label}}</router-link></span>
        <span class="nav-item"><router-link :to="props.loginItem.path">{{ props.loginItem.label }}</router-link></span>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background: #2c3e50;
  color: white;
}

a {
  color: white;
  margin-right: 12px;
  text-decoration: none;
}

button {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 6px 12px;
  cursor: pointer;
}

.right {
  display: flex;
  align-items: center;
}

/* Add | between items */
.nav-item:not(:last-child)::after {
  content: " | ";
  margin: 0 8px;
  color: #9ca3af;
}
</style>