import { type BuildRouteFunctionParams } from "../functionsBuilders";
import { type HandlerStep } from "../steps";
import { type RouterElementSystem } from "./types";
interface CreateRouterElementSystemParams {
    handlerStep: HandlerStep;
    buildParams: BuildRouteFunctionParams;
}
export declare function createRouterElementSystem(params: CreateRouterElementSystemParams): Promise<RouterElementSystem>;
export {};
