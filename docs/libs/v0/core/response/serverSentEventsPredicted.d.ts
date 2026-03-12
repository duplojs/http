import { Response, type SuccessResponseCode } from "../response";
import { type ServerSentEvents } from "../serverSentEvents";
import { type MaybePromise } from "@duplojs/utils";
declare const ServerSentEventsPredictedResponse_base: new (params: {
    "@DuplojsHttpCore/server-sent-events-predicted-response"?: unknown;
}, parentParams: readonly [code: any, information: any, body: any]) => Response<any, any, any> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-sent-events-predicted-response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"server-sent-events-predicted-response", unknown>, unknown>;
export declare class ServerSentEventsPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericEvents extends ServerSentEvents.DefinitionShape = ServerSentEvents.DefinitionShape> extends ServerSentEventsPredictedResponse_base {
    startSendingEvents: (params: ServerSentEvents.StartSendingParams<GenericEvents>) => MaybePromise<void>;
    code: GenericCode;
    information: GenericInformation;
    body: undefined;
    constructor(code: GenericCode, information: GenericInformation, startSendingEvents: (params: ServerSentEvents.StartSendingParams<GenericEvents>) => MaybePromise<void>);
}
export {};
