import { setCurrentWorkingDirectory, SF } from "@duplojs/server-utils";
import { createHub, routeStore } from "@duplojs/http";
import { staticPlugin } from "@duplojs/http/static";
import { asserts, E, Path } from "@duplojs/utils";
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
		staticPlugin(sourceFolder, { prefix: "/static-folder" }),
	);
