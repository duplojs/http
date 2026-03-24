import { type Parser } from "../parser";
interface ParseRequestCookieHookParams {
    parser: Parser;
}
export declare function parseRequestCookieHook(params: ParseRequestCookieHookParams): {
    readonly beforeRouteExecution: ({ request, next }: import("../../../core/route").RouteHookParams) => import("../../../core/route").RouteHookNext;
};
export {};
