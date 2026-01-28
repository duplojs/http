import { createHub, routeStore } from "@duplojs/http";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";

export const hub = createHub({ environment: "DEV" })
	.plug(codeGeneratorPlugin({ outputFile: "/types.d.ts" }))
	.register(routeStore.getAll());

