import { createHub } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";

const hub = createHub({ environment: "DEV" });

await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
