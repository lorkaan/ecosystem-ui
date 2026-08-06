import { DrfApiHandler } from "@ecosystem/api-client";

export class ScheduleDrfApiHandler extends DrfApiHandler{

    protected static apiPath = "/api/schedule";
}

export class EventApiHandler extends ScheduleDrfApiHandler{

    protected static appNameUrl = "events";

}

export class EventType extends ScheduleDrfApiHandler{

    protected static appNameUrl = "event-types";
}

export class EventStatus extends ScheduleDrfApiHandler{

    protected static appNameUrl = "event-statuses";
}

export class DeadlineApiHandler extends ScheduleDrfApiHandler{

    protected static appNameUrl = "deadlines";

}

export class DeadlineTypeApiHandler extends ScheduleDrfApiHandler{

    protected static appNameUrl = "deadline-types";
}

export class DeadlineStatus extends ScheduleDrfApiHandler{

    protected static appNameUrl = "deadline-statuses";
}