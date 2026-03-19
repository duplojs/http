import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const maxAgeFunction = {
	default(maxAge: string) {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-max-age", maxAge);
		};
	},
};
