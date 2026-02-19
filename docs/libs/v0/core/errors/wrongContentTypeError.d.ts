declare const WrongContentTypeError_base: new (params: {
    "@DuplojsHttpCore/wrong-content-type-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/wrong-content-type-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"wrong-content-type-error", unknown>, unknown>;
export declare class WrongContentTypeError extends WrongContentTypeError_base {
    expectedContentType: string;
    contentType: string;
    constructor(expectedContentType: string, contentType: string);
}
export {};
