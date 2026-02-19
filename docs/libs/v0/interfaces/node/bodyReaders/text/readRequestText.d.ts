import { E } from "@duplojs/utils";
import type http from "http";
export interface ReadRequestTextParams {
    maxBodySize: number;
}
export declare function readRequestText<GenericOutputValue extends unknown = string>(request: http.IncomingMessage, params: ReadRequestTextParams, onEnd?: (result: string) => GenericOutputValue): Promise<E.Left<"server-error", unknown> | E.Error<Error> | GenericOutputValue>;
