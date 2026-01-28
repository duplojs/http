import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";

const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll())
	.plug(codeGeneratorPlugin({ outputFile: "types.d.ts" }));

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
