import { type ResponseCode, Response } from "../response";
declare const PredictedResponse_base: new (params: {
    "@DuplojsHttpCore/predicted-response"?: unknown;
}, parentParams: [code: any, information: any, body: any]) => Response<any, any, any> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/predicted-response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"predicted-response", unknown>, unknown>;
export declare class PredictedResponse<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends PredictedResponse_base {
    code: GenericCode;
    information: GenericInformation;
    body: GenericBody;
    constructor(code: GenericCode, information: GenericInformation, body: GenericBody);
}
export {};
