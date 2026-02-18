import { type Route } from "../route";
import { type Steps } from "../steps";
declare const RouterBuildError_base: new (params: {
    "@DuplojsHttpCore/router-build-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/router-build-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"router-build-error", unknown>, unknown>;
export declare class RouterBuildError extends RouterBuildError_base {
    route: Route;
    element: Route | Steps;
    constructor(route: Route, element: Route | Steps);
}
export {};
