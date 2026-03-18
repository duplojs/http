import { type BuildRouteFunctionParams } from "../functionsBuilders";
import { type HandlerStep } from "../steps";
interface BuildSystemRouteParams {
    handlerStep: HandlerStep;
    buildParams: BuildRouteFunctionParams;
}
export declare function buildSystemRoute(params: BuildSystemRouteParams): Promise<{
    bodyReader: import("../request").BodyReader<"empty">;
    buildedRoute: import("../functionsBuilders").BuildedRouteFunction;
}>;
export {};
