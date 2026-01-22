import { type ResponseCode, Response } from "../response";
import { type HookRouteLifeCycle } from "../route/hooks";
declare const HookResponse_base: new (params: {
    "@DuplojsHttpCore/hook-response"?: unknown;
}, parentParams: [code: any, information: any, body: any]) => Response<any, any, any> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/hook-response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"hook-response", unknown>, unknown>;
export declare class HookResponse<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends HookResponse_base {
    code: GenericCode;
    information: GenericInformation;
    body: GenericBody;
    fromHook: keyof HookRouteLifeCycle;
    constructor(from: keyof HookRouteLifeCycle, code: GenericCode, information: GenericInformation, body: GenericBody);
}
export {};
