import { createHub } from "@duplojs/http";
import { SF } from "@duplojs/server-utils";
import { makeRouteFolder } from "@duplojs/http/static";

const docsRoute = makeRouteFolder({
	source: SF.createFolderInterface("./public/docs"),
	prefix: "/docs",
	directoryFallBackFile: "index.html",
	cacheControlConfig: {
		maxAge: 600,
		public: true,
	},
});

export const hub = createHub({ environment: "DEV" })
	.register(docsRoute);
