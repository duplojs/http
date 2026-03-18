import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const allowHeadersFunction = {
	default(allowHeaders: string) {
		return (request: Request, response: Response) => {
			response.setHeader("Access-Control-Allow-Headers", allowHeaders);
		};
	},
};
