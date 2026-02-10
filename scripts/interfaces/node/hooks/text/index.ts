import { type HttpServerParams, type Hub } from "@core/hub";
import { E, type Json, stringToBytes, unwrap } from "@duplojs/utils";
import type http from "http";
import { readRequestText } from "./readRequestText";

export * from "./readRequestText";

export function createProcessingText(
	hub: Hub,
	serverParams: HttpServerParams,
) {
	const isDev = hub.config.environment === "DEV";
	const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);

	return async(request: http.IncomingMessage) => {
		const result = await readRequestText(
			request,
			{ maxBodySize: serverMaxBodySize },
			(result) => request.headers["content-type"]?.includes("application/json")
				? JSON.parse(result) as Json
				: result,
		);

		if (E.isLeft(result)) {
			throw unwrap(result);
		}

		return result;
	};
}
