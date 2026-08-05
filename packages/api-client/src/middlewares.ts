import { ApiHandler } from "./http";

export function jsonMiddleware(options: RequestInit): RequestInit {
    const headers = ApiHandler.normalizeHeaders(options.headers);

    return {
        ...options,
        headers: {
            ...headers,
            "Content-Type": headers["Content-Type"] ?? "application/json",
        },
    };
}