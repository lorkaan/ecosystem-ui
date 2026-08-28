import { DrfApiHandler } from "@ecosystem/api-client";


export class DynamicFormTypeApiHandler extends DrfApiHandler{

    protected static appNameUrl = "form-types";

    static get_latest(code: string){
        if(code.length > 0){
            return this.apiFetch(this.joinUrls(this.getPath("latest"), `?${this.buildQueryString({
                "code": code
            })}`));
        }else{
            return this.apiFetch(this.getPath("latest"));
        }
    }

}

export class DynamicFormInstanceApiHandler extends DrfApiHandler {
    protected static appNameUrl = "form-instances";

    static create(data: any) {
        return this.apiFetch(this.getPath(), {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static update(id: string, data: any) {
        return this.apiFetch(this.getPath(id), {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    static submit(id: string) {
        return this.apiFetch(this.getPath(`${id}/submit`), {
            method: "POST",
        });
    }

    static lock(id: string) {
        return this.apiFetch(this.getPath(`${id}/lock`), {
            method: "POST",
        });
    }
}

export class DynamicFormQuestionApiHandler extends DrfApiHandler{

    protected static appNameUrl = "form-questions";
}