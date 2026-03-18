import type { Request } from "@core/request";
import type { Response } from "@core/response";

export const allowMethodsFunction = {
	default(methods: string) {
		return (request: Request, response: Response) => {
			response.setHeader("Access-Control-Allow-Methods", methods);
		};
	},

	isBool(allowMethods: Record<string, string>) {
		return (request: Request, response: Response) => {
			response.setHeader("Access-Control-Allow-Methods", allowMethods[request.path]);
		};
	},
};
