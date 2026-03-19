import type { Request } from "../../../core/request";
import type { Response } from "../../../core/response";
export declare const allowHeadersFunction: {
    default(allowHeaders: string): (request: Request, response: Response) => void;
};
