
export type RequestMiddleware = (
    options: RequestInit
) => RequestInit;

export class ApiHandler{

    protected static get defaultCredentials(): RequestCredentials {
        return "omit";
    }

    protected static baseUrl = "";

    protected static middlewares: RequestMiddleware[] = [];

    static addMiddleware(...middlewares: RequestMiddleware[]) {
        this.middlewares = [
            ...this.middlewares,
            ...middlewares,
        ];
    }

    static getMiddlewares(){
        return this.middlewares;
    }

    static getBaseUrl() {
        return this.baseUrl;
    }

    static joinUrls(url1: string, url2: string): string{
        if(url1.length > 0 && url2.length > 0){
            return `${url1.replace(/\/+$/, "")}/${url2.replace(/^\/+/, "")}`;
        }else if(url1.length > 0){
            return url1;
        }else{
            return url2;
        }
    }

    static buildUrl(endpoint: string) {
        return endpoint.startsWith("http")
            ? endpoint
            : `${this.getBaseUrl()}${endpoint}`;
    }

    static normalizeHeaders(headers?: HeadersInit): Record<string, string> {
        if (!headers) return {};

        let result: Record<string, string>;

        if (headers instanceof Headers) {
            result = Object.fromEntries(headers.entries());
        } else if (Array.isArray(headers)) {
            result = Object.fromEntries(headers);
        } else {
            result = headers;
        }

        // normalize keys to lowercase
        return Object.fromEntries(
            Object.entries(result).map(([k, v]) => [k.toLowerCase(), v])
        );
    }

    static apiFetch(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {

        const callerHeaders = this.normalizeHeaders(options.headers);

        let config = {
            ...options,
        };

        for (const middleware of this.getMiddlewares()) {
            config = middleware(config);
        }

        const middlewareHeaders = this.normalizeHeaders(config.headers);

        config.headers = {
            ...middlewareHeaders,
            ...callerHeaders,
        };

        config.credentials = options.credentials ?? this.defaultCredentials;

        const url = this.buildUrl(endpoint);

        return fetch(url, config);
    }
}
