import { shallowReactive , inject, type InjectionKey  } from "vue"
import type { AuthHandlerInterface } from "../types/authHandler"
import type { AuthState, AuthStore } from "../types/authState"

export function createAuthStore<TUser>(
  handler: AuthHandlerInterface,
  parseUser: (data: unknown) => TUser | null,
): AuthStore<TUser> {

  const state = shallowReactive <AuthState<TUser>>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  })

  async function checkAuth() {
    state.isLoading = true

    try {
      const res = await handler.getMe()

      if (res.status === 401) {
        state.isAuthenticated = false
        state.user = null
        return
      }

      if (!res.ok) {
        throw new Error("Auth check failed")
      }

      const data = await res.json()

      state.user = parseUser(data);
      state.isAuthenticated = true

    } catch (err) {
      console.error("Auth check error:", err)

      state.isAuthenticated = false
      state.user = null

    } finally {
      state.isLoading = false
    }
  }

  async function login(username: string, password: string) {
    if (handler.initCSRF) {
      await handler.initCSRF()
    }

    const res = await handler.login(username, password)

    if (!res.ok) {
      throw new Error("Login failed")
    }

    await checkAuth()
  }

  async function logout() {
    try {
      await handler.logout()
    } finally {
      state.isAuthenticated = false
      state.user = null
    }
  }

  return {
    state,
    checkAuth,
    login,
    logout,
  }
}

export const AUTH_STORE_KEY = Symbol("authStore") as InjectionKey<AuthStore<any>>;

export function useAuthStore<TUser>(): AuthStore<TUser> {
  console.log("Inject KEY", AUTH_STORE_KEY);
  const store = inject(AUTH_STORE_KEY);

  if (!store) {
    throw new Error("AuthStore has not been provided.");
  }

  return store as AuthStore<TUser>;
}