import { DjangoJsonApiHandler } from "./django_http";

export class DjangoApiPathHandler extends DjangoJsonApiHandler{
    protected static apiPath = "/api";

    protected static appNameUrl = "";

    static getAppNameUrl() {
        return this.appNameUrl;
    }

    static getApiPath() {
        return this.apiPath;
    }

    static getAppPath(){
        if(this.getApiPath().length > 0){
            return this.joinUrls(this.getApiPath(), this.getAppNameUrl());
        }else{
            return this.getAppNameUrl()
        }
    }

    static getPath(suffix: string = ""){
        if(suffix.length > 0){
            return this.joinUrls(this.getAppPath(), suffix);
        }else{
            return this.getAppPath()
        }
    }
}