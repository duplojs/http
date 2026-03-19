import { type Route, type HookRouteLifeCycle } from "../route";
import { type MaybeArray, type MaybePromise, type DP } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type HandlerStepFunctionParams, type HandlerStep } from "../steps";
import { type BodyController, type BodyReaderImplementation, Request } from "../request";
import { type ClientErrorResponseCode, type ResponseContract } from "../response";
import { type Environment } from "../types";
import { type createStepFunctionBuilder } from "../functionsBuilders/steps";
import { type createRouteFunctionBuilder } from "../functionsBuilders/route";
import { type createRouterFunctionBuilder } from "../functionsBuilders/router";
export * from "./hooks";
export * from "./defaultNotfoundHandler";
export * from "./defaultExtractContract";
export * from "./defaultBodyController";
export * from "./defaultMalformedUrlHandler";
export * from "./defaultEmptyReaderImplementation";
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
    readonly bodyReaderImplementations?: readonly BodyReaderImplementation[];
}
declare const Hub_base: new (params?: {
    "@DuplojsHttpCore/hub"?: unknown;
} | undefined) => import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/hub", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"hub", unknown>, unknown>;
export declare class Hub<GenericConfig extends HubConfig = HubConfig> extends Hub_base {
    config: GenericConfig;
    plugins: HubPlugin[];
    hooksRouteLifeCycle: HookRouteLifeCycle[];
    hooksHubLifeCycle: HookHubLifeCycle[];
    routes: Set<Route<import("../route").RouteDefinition>>;
    routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder> | undefined;
    routeFunctionBuilders: ReturnType<typeof createRouteFunctionBuilder>[];
    stepFunctionBuilders: ReturnType<typeof createStepFunctionBuilder>[];
    bodyReaderImplementations: BodyReaderImplementation[];
    classRequest: typeof Request;
    notfoundHandler: HandlerStep;
    defaultExtractContract: ResponseContract.Contract<ClientErrorResponseCode, string, DP.DataParserEmpty>;
    defaultBodyController: BodyController;
    malformedUrlHandler: HandlerStep;
    private constructor();
    register(routes: Route | Iterable<Route> | Record<string, Route>): this;
    setRouterFunctionBuilder(functionBuilder: ReturnType<typeof createRouterFunctionBuilder>): this;
    addRouteFunctionBuilder(functionBuilder: MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>): this;
    addStepFunctionBuilder(functionBuilder: MaybeArray<ReturnType<typeof createStepFunctionBuilder>>): this;
    addRouteHooks(hook: MaybeArray<HookRouteLifeCycle>): this;
    addHubHooks(hook: MaybeArray<HookHubLifeCycle>): this;
    addBodyReaderImplementation(bodyReaderImplementation: MaybeArray<BodyReaderImplementation>): this;
    plug(plugin: HubPlugin | ((self: this) => HubPlugin)): this;
    setNotfoundHandler<GenericResponseContract extends ResponseContract.Contract, GenericResponse extends ResponseContract.Convert<GenericResponseContract>>(responseContract: GenericResponseContract, theFunction: (param: HandlerStepFunctionParams<GenericResponse>) => MaybePromise<GenericResponse>): this;
    setDefaultExtractContract(responseContract: this["defaultExtractContract"]): this;
    aggregatesHooksHubLifeCycle<GenericHookName extends keyof HookHubLifeCycle>(hookName: GenericHookName): (NonNullable<HookHubLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookHubLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr : InnerArr : T : never : never)[];
    setDefaultBodyController(bodyController: BodyController): this;
    aggregatesHooksRouteLifeCycle<GenericHookName extends keyof HookRouteLifeCycle>(hookName: GenericHookName): (NonNullable<HookRouteLifeCycle[GenericHookName]> extends infer T ? T extends NonNullable<HookRouteLifeCycle[GenericHookName]> ? T extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr : InnerArr : T : never : never)[];
    setMalformedUrlHandler<GenericResponseContract extends ResponseContract.Contract, GenericResponse extends ResponseContract.Convert<GenericResponseContract>>(responseContract: GenericResponseContract, theFunction: (param: HandlerStepFunctionParams<GenericResponse>) => MaybePromise<GenericResponse>): this;
}
export declare function createHub<const GenericConfig extends HubConfig>(config: GenericConfig): Hub<GenericConfig>;
