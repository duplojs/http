import { type Hub } from "@core/hub";
import { ServerSentEventsPredictedResponse } from "@core/response";
import { createHookRouteLifeCycle } from "@core/route";
import { ServerSentEvents } from "@core/serverSentEvents";
import { type HttpServerParams } from "@core/types";
import { SF } from "@duplojs/server-utils";
import { A } from "@duplojs/utils";
import { createReadStream } from "node:fs";

export function initNodeHook(
	hub: Hub,
	serverParams: HttpServerParams,
) {
	const isDev = hub.config.environment === "DEV";

	return createHookRouteLifeCycle({
		beforeSendResponse({ request, currentResponse, exit }) {
			request.raw.response.writeHead(
				Number(currentResponse.code),
				currentResponse.headers,
			);

			return exit();
		},
		async sendResponse({ request, currentResponse, exit }) {
			const { response: rawResponse, request: rawRequest } = request.raw;

			if (currentResponse instanceof ServerSentEventsPredictedResponse) {
				const handler = ServerSentEvents.init(
					currentResponse as ServerSentEventsPredictedResponse,
					{
						lastId: typeof request.headers["last-event-id"] === "string"
							? request.headers["last-event-id"]
							: null,
					},
				);
				rawRequest.on("close", handler.abort);
				void handler.start(
					(value) => new Promise(
						(resolve) => {
							if (!rawResponse.write(value)) {
								rawResponse.once("drain", resolve);
							} else {
								resolve();
							}
						},
					),
					() => void rawResponse.end(),
				);
				return exit();
			}

			const body = currentResponse.body;

			if (body instanceof Error) {
				rawResponse.write(
					body.toString(),
				);
			} else if (SF.isFileInterface(body)) {
				await new Promise<void>((resolve, reject) => {
					createReadStream(body.path)
						.pipe(
							request.raw.response
								.once("error", reject)
								.once("close", resolve),
						);
				});
			} else if (
				typeof body === "object"
				|| typeof body === "number"
				|| typeof body === "boolean"
			) {
				rawResponse.write(
					JSON.stringify(body),
				);
			} else if (typeof body === "string") {
				rawResponse.write(body);
			}

			rawResponse.end();

			return exit();
		},
		async afterSendResponse({ request, next }) {
			if (request.filesAttache) {
				await Promise.all(
					A.map(
						request.filesAttache,
						(path) => SF.remove(path),
					),
				);
			}

			return next();
		},
	});
}
