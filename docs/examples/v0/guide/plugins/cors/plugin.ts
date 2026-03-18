import { createHub } from "@duplojs/http";
import { corsPlugin } from "@duplojs/http/cors";

export const hub = createHub({ environment: "DEV" })
	.plug(
		corsPlugin({
			allowOrigin: [
				"https://app.example.com",
				"https://admin.example.com",
			],
			allowHeaders: ["content-type", "authorization"],
			exposeHeaders: ["x-request-id", "x-rate-limit-remaining"],
			allowMethods: true,
			credentials: true,
			maxAge: 600,
		}),
	);
