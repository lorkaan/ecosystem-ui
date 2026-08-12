import { CsrfApiHandler } from "./crsf_http";
import { jsonMiddleware } from "./middlewares";
import { RequestMiddleware } from "./http";

export class DjangoJsonApiHandler extends CsrfApiHandler{}

DjangoJsonApiHandler.addMiddleware(jsonMiddleware);
