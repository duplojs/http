import { createHub, routeStore } from "@duplojs/http";

import "./route"; // don't forget !

const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll());
