declare const BodyParseUnknownError_base: new (params: {
    "@DuplojsHttpInterfacesNode/body-parse-unknown-error"?: unknown;
}, parentParams: [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpInterfacesNode/body-parse-unknown-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"body-parse-unknown-error", unknown>, unknown>;
export declare class BodyParseUnknownError extends BodyParseUnknownError_base {
    contentType: string;
    unknownError: unknown;
    constructor(contentType: string, unknownError: unknown);
}
export {};
