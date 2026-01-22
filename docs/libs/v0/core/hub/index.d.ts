import { type Route, type HookRouteLifeCycle } from "../route";
import { type Kind, type MaybeArray, type MaybePromise, type DP } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type HandlerStepFunctionParams, type HandlerStep } from "../steps";
import { Request } from "../request";
import { type ClientErrorResponseCode, type ResponseContract } from "../response";
import { type Environment } from "../types";
import { type createStepFunctionBuilder } from "../functionsBuilders/steps";
import { type createRouteFunctionBuilder } from "../functionsBuilders/route";
export * from "./hooks";
export * from "./defaultNotfoundHandler";
export * from "./defaultExtractContract";
export declare const hubKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/hub", unknown>>;
export interface HubConfig {
    readonly environment: Environment;
}
export interface HubPlugin {
    readonly name: string;
    readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
    readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
    readonly routes?: readonly Route[];
    readonly routeFunctionBuilders?: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders?: readonly ReturnType<typeof createStepFunctionBuilder>[];
}
export interface HubAggregates {
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
    readonly routes: readonly Route[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
}
export interface Hub<GenericConfig extends HubConfig = HubConfig> extends Kind<typeof hubKind.definition> {
    readonly config: GenericConfig;
    readonly plugins: readonly HubPlugin[];
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
    readonly routes: readonly Route[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly classRequest: typeof Request;
    readonly notfoundHandler: HandlerStep;
    readonly defaultExtractContract: ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>;
    register(routes: Route | Iterable<Route> | Record<string, Route>): Hub<GenericConfig>;
    addRouteFunctionBuilder(functionBuilder: MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>): Hub<GenericConfig>;
    addStepFunctionBuilder(functionBuilder: MaybeArray<ReturnType<typeof createStepFunctionBuilder>>): Hub<GenericConfig>;
    addRouteHooks(hook: MaybeArray<HookRouteLifeCycle>): Hub<GenericConfig>;
    addHubHooks(hook: MaybeArray<HookHubLifeCycle>): Hub<GenericConfig>;
    plug(plugin: HubPlugin | ((self: this) => HubPlugin)): Hub<GenericConfig>;
    setNotfoundHandler<GenericResponseContract extends ResponseContract.Contract, GenericResponse extends ResponseContract.Convert<GenericResponseContract>>(responseContract: GenericResponseContract, theFunction: (param: HandlerStepFunctionParams<Request, GenericResponse>) => MaybePromise<GenericResponse>): Hub<GenericConfig>;
    setDefaultExtractContract(responseContract: this["defaultExtractContract"]): Hub<GenericConfig>;
    aggregates(): HubAggregates;
    aggregatesRoutes(): readonly Route[];
    aggregatesRouteFunctionBuilders(): readonly ReturnType<typeof createRouteFunctionBuilder>[];
    aggregatesStepFunctionBuilders(): readonly ReturnType<typeof createStepFunctionBuilder>[];
    aggregatesHooksHubLifeCycle<GenericHookName extends keyof HookHubLifeCycle>(hookName: GenericHookName): readonly Exclude<HookHubLifeCycle[GenericHookName], undefined>[];
    aggregatesHooksRouteLifeCycle<GenericHookName extends keyof HookRouteLifeCycle>(hookName: GenericHookName): readonly Exclude<HookRouteLifeCycle[GenericHookName], undefined>[];
}
export declare function createHub<const GenericConfig extends HubConfig>(config: GenericConfig): Hub<GenericConfig>;
