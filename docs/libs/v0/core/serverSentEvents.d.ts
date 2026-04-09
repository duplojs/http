import { type MaybePromise, type MillisecondInString } from "@duplojs/utils";
import { Stream } from "./stream";
export declare namespace ServerSentEvents {
    type DefinitionShape = [string, unknown];
    interface SendParams {
        id?: string;
        retry?: number | MillisecondInString;
    }
    interface StartSendingParams<GenericEvents extends DefinitionShape = DefinitionShape> extends Stream.StartSendingParams {
        send(...args: GenericEvents extends any ? [
            event: GenericEvents[0],
            ...(GenericEvents[1] extends undefined ? [data?: GenericEvents[1]] : [data: GenericEvents[1]]),
            params?: SendParams
        ] : never): Promise<void>;
        readonly lastId: string | null;
    }
    interface InitParams {
        readonly lastId: string | null;
    }
    function init(startSendingEvents: (params: StartSendingParams) => MaybePromise<void>, initParams: InitParams): Stream.Handler;
}
