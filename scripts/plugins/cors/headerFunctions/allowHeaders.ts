import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const allowHeadersFunction = {
	default(allowHeaders: string) {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-allow-headers", allowHeaders);
		};
	},
};
