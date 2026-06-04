import { Path } from "@duplojs/utils";
import { setCurrentWorkingDirectoryOrThrow, SF } from "@duplojs/server-utils";
import { createHub, routeStore } from "@duplojs/http";
import { staticPlugin } from "@duplojs/http/static";
import { corsPlugin } from "@duplojs/http/cors";
import { cookiePlugin } from "@duplojs/http/cookie";
import "@duplojs/http/codeGenerator";

import "./routes";

const sourceFile = SF.createFileInterface("files/fakeFiles/superTextFile.txt");
const sourceFolder = SF.createFolderInterface("files/fakeFiles");

setCurrentWorkingDirectoryOrThrow(Path.resolveRelative([import.meta.dirname, "../"]));

export const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll())
	.plug(
		staticPlugin(sourceFile, { path: "/static-file" }),
	)
	.plug(
		staticPlugin(sourceFolder, {
			prefix: "/static-folder",
			directoryFallBackFile: "1mb.jpg",
		}),
	)
	.plug(
		corsPlugin({
			allowOrigin: "localhost",
			allowHeaders: ["content-type", "accept"],
			allowMethods: true,
			credentials: true,
			exposeHeaders: ["info"],
			maxAge: 0,
		}),
	)
	.plug(
		cookiePlugin(),
	);
