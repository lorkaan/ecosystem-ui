export interface AuthHandlerInterface {
  getMe(): Promise<Response>
  login(username: string, password: string): Promise<Response>
  logout(): Promise<Response>
  initCSRF?(): Promise<Response>
}