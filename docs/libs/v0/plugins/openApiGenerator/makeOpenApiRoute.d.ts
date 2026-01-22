import { ResponseContract } from "../../core/response";
import type { RoutePath } from "../../core/route";
import { DP } from "@duplojs/utils";
export declare function makeOpenApiRoute(routePath: RoutePath, openApiPage: string): import("../../core/route").Route<{
    readonly method: "GET";
    readonly metadata: readonly [];
    readonly hooks: readonly [];
    readonly preflightSteps: readonly [];
    readonly paths: readonly [`/${string}`];
    readonly steps: readonly [import("../../core/steps").HandlerStep<{
        readonly responseContract: NoInfer<ResponseContract.Contract<"200", "swaggerUi", DP.DataParserString<{
            readonly errorMessage?: string | undefined;
            readonly identifier?: string | undefined;
            readonly coerce: boolean;
            readonly checkers: readonly [];
        }>>>;
        theFunction(floor: {}, param: import("../../core/steps").HandlerStepFunctionParams<import("../../core/request").Request, import("../../core/response").PredictedResponse<"200", "swaggerUi", string>>): import("@duplojs/utils").MaybePromise<import("../../core/response").PredictedResponse<"200", "swaggerUi", string>>;
        readonly metadata: readonly [];
    }>];
}>;
