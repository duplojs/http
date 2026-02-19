declare const BodyParseWrongChunkReceived_base: new (params: {
    "@DuplojsHttpCore/body-parse-wrong-chunk-received"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/body-parse-wrong-chunk-received", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"body-parse-wrong-chunk-received", unknown>, unknown>;
export declare class BodyParseWrongChunkReceived extends BodyParseWrongChunkReceived_base {
    information: string;
    wrongChunk: unknown;
    constructor(information: string, wrongChunk: unknown);
}
export {};
