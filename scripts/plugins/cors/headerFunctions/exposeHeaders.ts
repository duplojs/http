import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const exposeHeadersFunction = {
	default(exposeHeaders: string) {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-expose-headers", exposeHeaders);
		};
	},
};
