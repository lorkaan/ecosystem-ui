import { ApiHandler } from "./http";

export class CsrfApiHandler extends ApiHandler{

    protected static initCsrfUrl = "/api/csrf/";

    protected static csrfExemptMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

    protected static get defaultCredentials(): RequestCredentials {
        return "include";
    }

    static getInitCsrfUrl() {
        return this.initCsrfUrl;
    }

    static getCsrfExemptMethods() {
        return this.csrfExemptMethods;
    }

    static getCSRFToken() {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1]
    }

    static initCSRF() {
        return fetch(this.joinUrls(this.getBaseUrl(), this.getInitCsrfUrl()), {
            credentials: 'include',
        })
    }

    static apiFetch(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {

        const headers = this.normalizeHeaders(options.headers);

        const method = (options.method ?? "GET").toUpperCase();

        const csrf = this.getCSRFToken();

        if (
            csrf &&
            !this.getCsrfExemptMethods().includes(method)
        ) {
            headers["x-csrftoken"] = csrf;
        }

        return super.apiFetch(endpoint, {
            ...options,
            headers,
        });
    }
}