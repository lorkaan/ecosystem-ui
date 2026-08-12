import { DjangoApiPathHandler } from "@ecosystem/api-client"

export class BasicAuthApiHandler extends DjangoApiPathHandler {

  protected static appNameUrl = "iam/auth";

  static initCSRF() {
    return this.apiFetch(this.getPath("csrf"));
  }

  static getMe() {
    return this.apiFetch(this.getPath("me"));
  }

  static login(username: string, password: string) {
    return this.apiFetch(this.getPath("login"), {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  static logout() {
    return this.apiFetch(this.getPath("logout"), {
      method: "POST",
    });
  }
}