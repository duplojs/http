import { createHub } from "@duplojs/http";
import { createCacheControllerHooks } from "@duplojs/http/cacheController";

export const hub = createHub({ environment: "DEV" })
	.addRouteHooks(
		createCacheControllerHooks({
			private: true,
			noCache: true,
		}),
	);
