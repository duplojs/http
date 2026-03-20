import { type Serializer } from "../serialize";
export interface SerializeResponseCookieHookParams {
    serializer: Serializer;
}
export declare function serializeResponseCookieHook(params: SerializeResponseCookieHookParams): {
    readonly beforeSendResponse: ({ currentResponse, next }: import("../../../core/route").RouteHookParamsAfter) => import("../../../core/route").RouteHookNext;
};
