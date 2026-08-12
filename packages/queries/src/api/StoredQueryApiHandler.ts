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

    static download(id: number | string, payload: Record<string, any> = {}, selected_fields: string[] = [], name: string = "Untitled"){

        const specific_path: string = `${id}/download`;

        const filename = window.prompt('Enter filename for download', name);

        const download_payload = {
            name: filename,
            selected_fields: selected_fields,
            ...payload
        }

        return this.apiFetch(this.joinUrls(this.getPath(), specific_path), {
            method: "POST",
            body: JSON.stringify(download_payload),
        });
    }

}