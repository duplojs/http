import type { HubPlugin } from "../../core/hub";
import { type Parser } from "./parser";
import { type Serializer } from "./serialize";
export interface CookiePluginParams {
    parser?: Parser;
    serializer?: Serializer;
}
export declare function cookiePlugin(params?: CookiePluginParams): () => HubPlugin;
