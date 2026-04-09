import { Response, type SuccessResponseCode } from "../response";
import { type Stream } from "../stream";
import { type MaybePromise } from "@duplojs/utils";
declare const StreamTextPredictedResponse_base: new (params: {
    "@DuplojsHttpCore/stream-text-predicted-response"?: unknown;
}, parentParams: readonly [code: any, information: any, body: any]) => Response<any, any, any> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/stream-text-predicted-response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"stream-text-predicted-response", unknown>, unknown>;
export declare class StreamTextPredictedResponse<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string> extends StreamTextPredictedResponse_base {
    startStream: (params: Stream.StartSendingParams<string>) => MaybePromise<void>;
    code: GenericCode;
    information: GenericInformation;
    body: undefined;
    constructor(code: GenericCode, information: GenericInformation, startStream: (params: Stream.StartSendingParams<string>) => MaybePromise<void>);
}
export {};
