import type { Request } from "@core/request";
import type { Response } from "@core/response";
import type { MaybePromise } from "@duplojs/utils";

export const allowOriginFunction = {
	default(allowOrigin: RegExp) {
		return (request: Request, response: Response) => {
			if (allowOrigin.test(request.origin)) {
				response.setHeader("Access-Control-Allow-Origin", request.origin);
			}
		};
	},

	isFunction(allowOrigin: (origin: string) => MaybePromise<boolean>) {
		return async(request: Request, response: Response) => {
			let result = allowOrigin(request.origin);
			if (result instanceof Promise) {
				result = await result;
			}

			if (result === true) {
				response.setHeader("Access-Control-Allow-Origin", request.origin);
			}
		};
	},
};
