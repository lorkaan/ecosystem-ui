import { DrfApiHandler } from "@ecosystem/api-client";

export class StoredQueryApiHandler extends DrfApiHandler{

    protected static appNameUrl = "queries";

    static run(id: number | string, payload: Record<string, any> = {}){

        const specific_path: string = `${id}/run`;

        return this.apiFetch(this.joinUrls(this.getPath(), specific_path), {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

}