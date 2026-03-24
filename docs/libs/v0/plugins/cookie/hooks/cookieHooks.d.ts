import { type Parser } from "../parser";
import { type Serializer } from "../serialize";
interface CookieHooksParams {
    parser?: Parser;
    serializer?: Serializer;
}
export declare function cookieHooks({ parser, serializer, }?: CookieHooksParams): {
    beforeSendResponse: ({ currentResponse, next }: import("../../../core/route").RouteHookParamsAfter) => import("../../../core/route").RouteHookNext;
    beforeRouteExecution: ({ request, next }: import("../../../core/route").RouteHookParams) => import("../../../core/route").RouteHookNext;
};
export {};
