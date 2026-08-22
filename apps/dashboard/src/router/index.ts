import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from "../components/Dashboard.vue";
import DeadlineList from '../components/DeadlineList.vue';
import EventList from '../components/EventList.vue';
import ToolbarLayout from '../layout/ToolbarLayout.vue';
import Login from "../components/auth/Login.vue";
import type { User } from '../types/user.ts';
import { useAuthStore } from "@ecosystem/auth";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: ToolbarLayout, // <- the layout wraps these children
      children: [
        {
          path: '', // default child route
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          component: Dashboard
        },
        {
          path: 'deadlines',
          component: DeadlineList
        },
        {
          path: 'events',
          component: EventList
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    }
  ]
});

/* ---------------------------
  GLOBAL ROUTE GUARD
---------------------------- */
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authStore = useAuthStore<User>()  // ✅ inside runtime

  await authStore.checkAuth()

  if (!authStore.state.isAuthenticated) {
    return '/login'
  }

  return true
})

export default router;