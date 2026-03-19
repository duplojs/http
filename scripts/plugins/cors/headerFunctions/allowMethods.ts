import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const allowMethodsFunction = {
	default(methods: string) {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-allow-methods", methods);
		};
	},

	isBool(allowMethods: Record<string, string>) {
		return (request: Request, response: Response) => {
			response.setHeader("access-control-allow-methods", allowMethods[request.path]);
		};
	},
};
