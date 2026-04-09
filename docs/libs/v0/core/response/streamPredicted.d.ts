import { Response, type SuccessResponseCode } from "../response";
import { type Stream } from "../stream";
import { type MaybePromise } from "@duplojs/utils";
declare const StreamPredictedResponse_base: new (params: {
    "@DuplojsHttpCore/stream-predicted-response"?: unknown;
}, parentParams: readonly [code: any, information: any, body: any]) => Response<any, any, any> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/stream-predicted-response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"stream-predicted-response", unknown>, unknown>;
export declare class StreamPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericFlux extends unknown = unknown> extends StreamPredictedResponse_base {
    startStream: (params: Stream.StartSendingParams<GenericFlux>) => MaybePromise<void>;
    code: GenericCode;
    information: GenericInformation;
    body: undefined;
    constructor(code: GenericCode, information: GenericInformation, startStream: (params: Stream.StartSendingParams<GenericFlux>) => MaybePromise<void>);
}
export {};
