import type { Request } from "../../../core/request";
import type { Response } from "../../../core/response";
export declare const exposeHeadersFunction: {
    default(exposeHeaders: string): (request: Request, response: Response) => void;
};
