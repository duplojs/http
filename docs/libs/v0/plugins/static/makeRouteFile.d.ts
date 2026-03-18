import { SDP, type SF } from "@duplojs/server-utils";
import { type AnyTuple } from "@duplojs/utils";
import { ResponseContract } from "../../core/response";
import type { RoutePath } from "../../core/route";
import { type CacheControlDirectives } from "../cacheController/types";
interface MakeRouteFileParams {
    readonly source: SF.FileInterface;
    readonly path: RoutePath | AnyTuple<RoutePath>;
    readonly cacheControlConfig?: CacheControlDirectives;
}
declare const MissingSelectedStaticFileError_base: new (params: {
    "@DuplojsStaticPlugin/missing-selected-static-file"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsStaticPlugin/missing-selected-static-file", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"missing-selected-static-file", unknown>, unknown>;
export declare class MissingSelectedStaticFileError extends MissingSelectedStaticFileError_base {
    source: SF.FileInterface;
    constructor(source: SF.FileInterface);
}
declare const SelectedStaticFileIsNotFileError_base: new (params: {
    "@DuplojsStaticPlugin/selected-static-file-is-not-file"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsStaticPlugin/selected-static-file-is-not-file", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"selected-static-file-is-not-file", unknown>, unknown>;
export declare class SelectedStaticFileIsNotFileError extends SelectedStaticFileIsNotFileError_base {
    source: SF.FileInterface;
    constructor(source: SF.FileInterface);
}
export declare function makeRouteFile(params: MakeRouteFileParams): import("../../core/route").Route<{
    readonly method: "GET";
    readonly metadata: readonly [import("../../core/metadata").Metadata<"ignore-by-route-store", unknown>];
    readonly hooks: readonly [{
        readonly beforeSendResponse: ({ currentResponse, next }: import("../../core/route").RouteHookParamsAfter) => import("../../core/route").RouteHookNext;
    }];
    readonly paths: readonly [`/${string}`] | AnyTuple<`/${string}`>;
    readonly preflightSteps: readonly [];
    readonly bodyController: null;
    readonly steps: readonly [import("../../core/steps").HandlerStep<{
        readonly responseContract: [NoInfer<ResponseContract.Contract<"200", "resource.found", SDP.DataParserFile<{
            readonly mimeType?: RegExp | undefined;
            readonly errorMessage?: string | undefined;
            readonly coerce: boolean;
            readonly minSize?: number | undefined;
            readonly maxSize?: number | undefined;
            readonly checkExist: boolean;
            readonly checkers: readonly [];
        }>>>, NoInfer<ResponseContract.Contract<"304", "resource.notModified", import("@duplojs/utils/dataParser").DataParserEmpty<import("@duplojs/utils/dataParser").DataParserDefinitionEmpty>>>];
        theFunction(floor: {}, param: import("../../core/steps").HandlerStepFunctionParams<import("../../core/response").PredictedResponse<"200", "resource.found", SF.FileInterface> | import("../../core/response").PredictedResponse<"304", "resource.notModified", undefined>>): import("@duplojs/utils").MaybePromise<import("../../core/response").PredictedResponse<"200", "resource.found", SF.FileInterface> | import("../../core/response").PredictedResponse<"304", "resource.notModified", undefined>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
