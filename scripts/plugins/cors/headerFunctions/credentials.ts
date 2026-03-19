import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const credentialsFunction = {
	default() {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-allow-credentials", "true");
		};
	},
};
