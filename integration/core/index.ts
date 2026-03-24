import { asserts, E, Path } from "@duplojs/utils";
import { setCurrentWorkingDirectory, SF } from "@duplojs/server-utils";
import { createHub, routeStore } from "@duplojs/http";
import { staticPlugin } from "@duplojs/http/static";
import { corsPlugin } from "@duplojs/http/cors";
import { cookiePlugin } from "@duplojs/http/cookie";

import "./routes";

const sourceFile = SF.createFileInterface("files/fakeFiles/superTextFile.txt");
const sourceFolder = SF.createFolderInterface("files/fakeFiles");

asserts(
	setCurrentWorkingDirectory(Path.resolveRelative([import.meta.dirname, "../"])),
	E.isRight,
);

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
