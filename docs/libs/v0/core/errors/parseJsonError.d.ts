declare const ParseJsonError_base: new (params: {
    "@DuplojsHttpCore/parse-json-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/parse-json-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"parse-json-error", unknown>, unknown>;
export declare class ParseJsonError extends ParseJsonError_base {
    payload: string;
    error: unknown;
    constructor(payload: string, error: unknown);
}
export {};
