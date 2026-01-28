import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";

const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll())
	.plug(
		openApiGeneratorPlugin({
			outputFile: "swagger.json",
			routePath: "/swagger-ui",
		}),
	);

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
