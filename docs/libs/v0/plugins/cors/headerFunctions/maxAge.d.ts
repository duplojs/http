import type { Request } from "../../../core/request";
import type { Response } from "../../../core/response";
export declare const maxAgeFunction: {
    default(maxAge: string): (request: Request, response: Response) => void;
};
