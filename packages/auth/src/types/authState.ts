export interface AuthState<TUser> {
  isAuthenticated: boolean
  user: TUser | null
  isLoading: boolean
}

export interface AuthStore<TUser> {
  state: AuthState<TUser>

  checkAuth: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}