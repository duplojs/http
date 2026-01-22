import "../../../core/request";
import "../../../core/steps";
import type http from "http";
export interface RawRequest {
    request: http.IncomingMessage;
    response: http.ServerResponse;
}
declare module "../../../core/steps" {
    interface DisabledExtractKeysCustom {
        raw: true;
    }
}
declare module "../../../core/request" {
    interface RequestInitializationData {
        raw: RawRequest;
    }
    interface Request {
        /**
         * @deprecated
         */
        raw: RawRequest;
    }
}
