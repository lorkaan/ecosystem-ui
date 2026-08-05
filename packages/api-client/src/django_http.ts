import { CsrfApiHandler } from "./crsf_http";
import { jsonMiddleware } from "./middleware";
import { RequestMiddleware } from "./http";

export class DjangoJsonApiHandler extends CsrfApiHandler{}

DjangoJsonApiHandler.addMiddleware(jsonMiddleware);
