<script setup lang="ts">
import { Toolbar, type ToolbarItem } from "@ecosystem/core-ui";
import type { User } from "../types/user";
import { useAuthStore } from "@ecosystem/auth";

const authStore = useAuthStore<User>();

const toolbarItems: ToolbarItem[] = [
    {
        path: "/dashboard",
        label: "Reports",
        visibility: "auth"
    },
    {
        path: "/events",
        label: "Events",
        visibility: "auth"
    },
    {
        path: "/deadlines",
        label: "Deadlines",
        visibility: "auth"
    }
];

const homeItem: ToolbarItem = {
    path: "/",
    label: "Home",
    visibility: "both"
};

const loginItem: ToolbarItem = {
    path: "/login",
    label: "Login",
    visibility: "unauth"
};

const logoutLabel: string = "Logout";

</script>

<template>
  <div>
    <Toolbar :authStore="authStore" :toolbarItems="toolbarItems" :homeItem="homeItem" :loginItem="loginItem" :logoutLabel="logoutLabel" />  <!-- always visible in this layout -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
main {
  padding: 20px;
}
</style>