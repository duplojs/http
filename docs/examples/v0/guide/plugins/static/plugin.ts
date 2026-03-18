import { createHub } from "@duplojs/http";
import { SF } from "@duplojs/server-utils";
import { staticPlugin } from "@duplojs/http/static";

const logoFile = SF.createFileInterface("./public/logo.svg");
const assetsFolder = SF.createFolderInterface("./public");

export const hub = createHub({ environment: "DEV" })
	.plug(
		staticPlugin(logoFile, {
			path: "/logo",
			cacheControlConfig: {
				maxAge: 3600,
				public: true,
			},
		}),
	)
	.plug(
		staticPlugin(assetsFolder, {
			prefix: "/assets",
		}),
	);
