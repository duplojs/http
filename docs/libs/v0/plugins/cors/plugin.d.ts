import { type AnyTuple, type MaybePromise, type O } from "@duplojs/utils";
import { type RequestMethods } from "../../core/request";
import { type HubPlugin } from "../../core/hub";
export interface CorsPluginParams {
    readonly allowOrigin?: string | RegExp | AnyTuple<string> | ((origin: string) => MaybePromise<boolean>) | true;
    readonly allowHeaders?: string | AnyTuple<string> | true;
    readonly exposeHeaders?: string | AnyTuple<string>;
    readonly maxAge?: number;
    readonly credentials?: boolean;
    readonly allowMethods?: RequestMethods | AnyTuple<RequestMethods> | true;
}
export declare function corsPlugin<GenericParams extends CorsPluginParams>(params: GenericParams & O.RequireAtLeastOne<GenericParams>): () => HubPlugin;
