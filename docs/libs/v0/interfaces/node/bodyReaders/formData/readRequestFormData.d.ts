import { E, type MaybePromise } from "@duplojs/utils";
import type http from "http";
interface HeaderPartInformation {
    name: string;
    filename?: string;
}
export interface ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator extends unknown = unknown> {
    onReceiveChunk(chunk: Buffer): MaybePromise<void>;
    onEndPart(valueAccumulator: GenericValueAccumulator): MaybePromise<GenericValueAccumulator>;
    onError: ((error: unknown, valueAccumulator: GenericValueAccumulator) => MaybePromise<void>) | null;
}
export interface ReadRequestFormDataParams {
    maxBodySize: number;
    maxFileQuantity: number;
    maxBufferSize: number;
    maxKeyLength: number;
    fileMaxSize: number;
    textFieldMaxSize: number;
    mimeType?: RegExp;
}
export declare function readRequestFormData<GenericValueAccumulator extends unknown, GenericOutputHeader extends E.Left = never>(request: http.IncomingMessage, firstValueAccumulator: GenericValueAccumulator, params: ReadRequestFormDataParams, onReceiveHeader: (header: HeaderPartInformation) => MaybePromise<ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator> | Error>): Promise<E.Left<"server-error", unknown> | GenericOutputHeader | E.Error<Error> | GenericValueAccumulator>;
export {};
