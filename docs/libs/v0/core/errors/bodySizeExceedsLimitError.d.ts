import { type BytesInString } from "@duplojs/utils";
declare const BodySizeExceedsLimitError_base: new (params: {
    "@DuplojsHttpCore/body-size-exceeds-limit-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-size-exceeds-limit-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"body-size-exceeds-limit-error", unknown>, unknown>;
export declare class BodySizeExceedsLimitError extends BodySizeExceedsLimitError_base {
    bytesInString: BytesInString | number;
    constructor(bytesInString: BytesInString | number);
}
export {};
