import { createHub } from "@duplojs/http";
import { SF } from "@duplojs/server-utils";
import { makeRouteFile } from "@duplojs/http/static";

const faviconRoute = makeRouteFile({
	source: SF.createFileInterface("./public/favicon.ico"),
	path: "/favicon.ico",
	cacheControlConfig: {
		maxAge: 86400,
		public: true,
	},
});

export const hub = createHub({ environment: "DEV" })
	.register(faviconRoute);
