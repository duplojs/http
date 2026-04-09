import { ResponseContract } from "../response";
import { DP } from "@duplojs/utils";
export declare const defaultNotfoundHandler: import("../steps").HandlerStep<{
    responseContract: NoInfer<ResponseContract.Contract<"404", "notfound-route", DP.DataParserString<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>>;
    theFunction: (floor: import("..").Floor, { request, response }: import("../steps").HandlerStepFunctionParams<import("../response").PredictedResponses>) => never;
    metadata: never[];
}>;
