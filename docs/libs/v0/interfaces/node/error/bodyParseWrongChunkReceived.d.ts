declare const BodyParseWrongChunkReceived_base: new (params: {
    "@DuplojsHttpInterfacesNode/body-parse-wrong-chunk-received"?: unknown;
}, parentParams: [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpInterfacesNode/body-parse-wrong-chunk-received", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"body-parse-wrong-chunk-received", unknown>, unknown>;
export declare class BodyParseWrongChunkReceived extends BodyParseWrongChunkReceived_base {
    wrongChunk: unknown;
    constructor(wrongChunk: unknown);
}
export {};
