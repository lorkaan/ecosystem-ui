import { DjangoApiPathHandler } from "./django_api_path";
import type { QueryParams } from "./types/queryParams";

export class DrfApiHandler extends DjangoApiPathHandler{

    static buildQueryString(params: QueryParams) {
        const searchParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value))
        })

        return searchParams.toString()
    }

    static list(params?: QueryParams) {
        if(params){
            return this.apiFetch(this.joinUrls(this.getPath(), `?${this.buildQueryString(params)}`));
        }else{
            return this.apiFetch(this.getPath());
        }
    }

    static getById(id: string, options: RequestInit = {}){
        return this.apiFetch(this.getPath(id), options);
    }

    static filter_schema(){
        return this.apiFetch(this.getPath("filter-schema"));
    }
}