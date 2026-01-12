import "./routes";
import { createHub, routeStore } from "@duplojs/http";

export const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll());
