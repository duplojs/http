import { type MillisecondInString } from "@duplojs/utils";
import { type ServerSentEventsPredictedResponse } from "./response";
export declare namespace ServerSentEvents {
    type DefinitionShape = [string, unknown];
    interface SendParams {
        id?: string;
        retry?: number | MillisecondInString;
    }
    interface StartSendingParams<GenericEvents extends DefinitionShape = DefinitionShape> {
        send(...args: GenericEvents extends any ? [
            event: GenericEvents[0],
            ...(GenericEvents[1] extends undefined ? [data?: GenericEvents[1]] : [data: GenericEvents[1]]),
            params?: SendParams
        ] : never): Promise<void>;
        abort(): void;
        onAbort(theFunction: () => void): void;
        isAbort(): boolean;
        close(): void;
        onClose(theFunction: () => void): void;
        isClose(): boolean;
        error(error: unknown): void;
        onError(theFunction: (error: unknown) => void): void;
        readonly lastId: string | null;
    }
    interface Handler {
        start(send: (value: string) => Promise<void>, close: () => void): Promise<void>;
        abort(): void;
    }
    interface InitParams {
        readonly lastId: string | null;
    }
    function init(response: ServerSentEventsPredictedResponse, initParams: InitParams): Handler;
}
