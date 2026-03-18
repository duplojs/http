import { type AnyTuple } from "@duplojs/utils";
import { SF } from "@duplojs/server-utils";
import type { HubPlugin } from "../../core/hub";
import type { RoutePath } from "../../core/route";
import { type CacheControlDirectives } from "../cacheController/types";
export interface BaseStaticPluginParams {
    readonly cacheControlConfig?: CacheControlDirectives;
}
export interface StaticPluginFileParams extends BaseStaticPluginParams {
    readonly path: RoutePath | AnyTuple<RoutePath>;
}
export interface StaticPluginFolderParams extends BaseStaticPluginParams {
    readonly prefix: RoutePath | AnyTuple<RoutePath>;
    readonly directoryFallBackFile?: string;
}
declare const StaticPluginError_base: new (params: {
    "@DuplojsStaticPlugin/static-plugin"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsStaticPlugin/static-plugin", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"static-plugin", unknown>, unknown>;
export declare class StaticPluginError extends StaticPluginError_base {
    information: string;
    error: unknown;
    constructor(information: string, error: unknown);
}
export declare function staticPlugin(source: SF.FolderInterface, params: StaticPluginFolderParams): HubPlugin;
export declare function staticPlugin(source: SF.FileInterface, params: StaticPluginFileParams): HubPlugin;
export {};
