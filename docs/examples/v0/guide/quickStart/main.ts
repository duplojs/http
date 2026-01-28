import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";

import "./routes/helloWorld";

const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll())
	.plug(codeGeneratorPlugin({ outputFile: "types.d.ts" }))
	.plug(openApiGeneratorPlugin({ routePath: "/swagger-ui" }));

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);

console.log("Server is ready !");
