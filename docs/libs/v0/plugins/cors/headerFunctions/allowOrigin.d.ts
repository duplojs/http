import type { Request } from "../../../core/request";
import type { Response } from "../../../core/response";
import type { MaybePromise } from "@duplojs/utils";
export declare const allowOriginFunction: {
    default(allowOrigin: RegExp): (request: Request, response: Response) => void;
    isFunction(allowOrigin: (origin: string) => MaybePromise<boolean>): (request: Request, response: Response) => Promise<void>;
};
