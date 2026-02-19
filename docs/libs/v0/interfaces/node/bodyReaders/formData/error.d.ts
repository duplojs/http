declare const BodyParseFormDataError_base: new (params: {
    "@DuplojsHttpInterfacesNode/body-parse-form-data-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpInterfacesNode/body-parse-form-data-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"body-parse-form-data-error", unknown>, unknown>;
export declare class BodyParseFormDataError extends BodyParseFormDataError_base {
    information: string;
    constructor(information: string);
}
export {};
