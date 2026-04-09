import { type MaybePromise, type AnyTuple } from "@duplojs/utils";
export declare namespace Stream {
    interface StartSendingParams<GenericFlux extends unknown = unknown> {
        send(...args: AnyTuple<GenericFlux>): Promise<void>;
        abort(): void;
        onAbort(theFunction: () => void): void;
        isAbort(): boolean;
        close(): void;
        onClose(theFunction: () => void): void;
        isClose(): boolean;
        error(error: unknown): void;
        onError(theFunction: (error: unknown) => void): void;
    }
    interface Handler {
        start(send: (value: unknown) => Promise<void>, close: () => void): Promise<void>;
        abort(): void;
    }
    function init(startStream: (params: StartSendingParams) => MaybePromise<void>): Handler;
}
