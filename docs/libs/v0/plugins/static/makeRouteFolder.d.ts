import { SDP, SF } from "@duplojs/server-utils";
import { type AnyTuple } from "@duplojs/utils";
import { ResponseContract } from "../../core/response";
import type { RoutePath } from "../../core/route";
import { type CacheControlDirectives } from "../cacheController/types";
interface MakeRouteFolderParams {
    readonly source: SF.FolderInterface;
    readonly prefix: RoutePath | AnyTuple<RoutePath>;
    readonly cacheControlConfig?: CacheControlDirectives;
    readonly directoryFallBackFile?: string;
}
export declare function makeRouteFolder(params: MakeRouteFolderParams): import("../../core/route").Route<{
    readonly method: "GET";
    readonly metadata: readonly [import("../../core/metadata").Metadata<"ignore-by-route-store", unknown>];
    readonly hooks: readonly [{
        readonly beforeSendResponse: ({ currentResponse, next }: import("../../core/route").RouteHookParamsAfter) => import("../../core/route").RouteHookNext;
    }];
    readonly paths: [`/${string}/*`] | [`/${string}/*`, ...`/${string}/*`[]];
    readonly preflightSteps: readonly [];
    readonly bodyController: null;
    readonly steps: readonly [import("../../core/steps").HandlerStep<{
        readonly responseContract: [NoInfer<ResponseContract.Contract<"200", "resource.found", SDP.DataParserFile<{
            readonly errorMessage?: string | undefined;
            readonly coerce: boolean;
            readonly checkers: readonly [];
        }>>>, NoInfer<ResponseContract.Contract<"404", "resource.notfound", import("@duplojs/utils/dataParser").DataParserEmpty<{
            readonly errorMessage?: string | undefined;
            readonly coerce: boolean;
            readonly checkers: readonly [];
        }>>>, NoInfer<ResponseContract.Contract<"304", "resource.notModified", import("@duplojs/utils/dataParser").DataParserEmpty<import("@duplojs/utils/dataParser").DataParserDefinitionEmpty>>>];
        theFunction(floor: {}, params: import("../../core/steps").HandlerStepFunctionParams<import("../../core/response").PredictedResponse<"200", "resource.found", SF.FileInterface> | import("../../core/response").PredictedResponse<"404", "resource.notfound", undefined> | import("../../core/response").PredictedResponse<"304", "resource.notModified", undefined>>): import("@duplojs/utils").MaybePromise<import("../../core/response").PredictedResponse<"200", "resource.found", SF.FileInterface> | import("../../core/response").PredictedResponse<"404", "resource.notfound", undefined> | import("../../core/response").PredictedResponse<"304", "resource.notModified", undefined>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
