import type { Request } from "@core/request";
import type { Response } from "@core/response";

const starRegex = /(^|,) *\* *(?=,|$)/;
const originRegex = /(^|,) *origin *(?=,|$)/i;

export const varyFunction = {
	default() {
		const maxStoreSize = 500;
		const store = new Map<string, string>();

		return (request: Request, response: Response) => {
			const cachedVary = store.get(request.origin);

			if (cachedVary) {
				response.setHeader("vary", cachedVary);
				return;
			}

			let varyValue = Array.isArray(response.headers?.vary)
				? response.headers.vary.join(", ")
				: response.headers?.vary;

			if (varyValue === undefined) {
				varyValue = "Origin";
			} else if (starRegex.test(varyValue)) {
				varyValue = "*";
			} else if (!originRegex.test(varyValue)) {
				varyValue = `${varyValue}, Origin`;
			}

			if (store.size < maxStoreSize) {
				store.set(request.origin, varyValue);
			}

			response.setHeader("vary", varyValue);
		};
	},
};
