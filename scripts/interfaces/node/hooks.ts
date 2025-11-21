import { type HttpServerParams, type Hub } from "@core/hub";
import { createHookRouteLifeCycle, HookResponse } from "@core/route";
import { stringToBytes } from "@duplojs/utils";
import { BodyParseUnknownError, BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "./error";
import { exit } from "process";

export function makeNodeHook(hub: Hub, serverParams: HttpServerParams) {
	const informationHeaderKey = serverParams.informationHeaderKey;
	const fromHookHeaderKey = serverParams.fromHookHeaderKey;
	const isDev = hub.config.environment === "DEV";
	const maxBodySize = stringToBytes(serverParams.maxBodySize);

	return createHookRouteLifeCycle({
		async parseBody({ request, exit }) {
			const contentType = request.headers["content-type"] instanceof Array
				? request.headers["content-type"].join(", ")
				: request.headers["content-type"] ?? "";

			const isText = contentType.includes("text/plain");
			const isJson = contentType.includes("application/json");

			if (!isText && !isJson) {
				return exit();
			}

			const { request: rawRequest } = request.raw;

			request.body = await new Promise<unknown>(
				(resolve, reject) => {
					function errorCallback(error: unknown) {
						if (
							error instanceof BodySizeExceedsLimitError
							|| error instanceof BodyParseWrongChunkReceived
						) {
							reject(error);
							return;
						}

						reject(new BodyParseUnknownError(contentType, error));
					}

					let stringBody = "";
					let byteLengthBody = 0;

					rawRequest.on("error", errorCallback);

					rawRequest.on("data", (chunk: unknown) => {
						if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
							rawRequest.emit(
								"error",
								new BodyParseWrongChunkReceived(chunk),
							);
							return;
						}

						byteLengthBody += chunk instanceof Buffer
							? chunk.byteLength
							: Buffer.byteLength(chunk);

						if (byteLengthBody > maxBodySize) {
							rawRequest.emit(
								"error",
								new BodySizeExceedsLimitError(serverParams.maxBodySize),
							);
							return;
						}
						stringBody += chunk.toString();
					});

					rawRequest.on("end", () => {
						try {
							resolve(
								isText
									? stringBody
									: JSON.parse(stringBody),
							);
						} catch (error) {
							errorCallback(error);
						}
					});
				},
			);

			return exit();
		},
		error({ error, response }) {
			if (error instanceof BodySizeExceedsLimitError) {
				return response(
					"400",
					"body-size-exceeds-limit-error",
					isDev ? error : undefined,
				);
			} else if (error instanceof BodyParseWrongChunkReceived) {
				return response(
					"400",
					"body-parse-wrong-chunk-received",
					isDev ? error : undefined,
				);
			} else if (error instanceof BodyParseUnknownError) {
				return response(
					"400",
					"body-parse-unknown-error",
					isDev ? error : undefined,
				);
			}

			return exit();
		},
		beforeSendResponse({ request, currentResponse, exit }) {
			const body = currentResponse.body;

			if (
				typeof body === "number"
				|| typeof body === "string"
				|| body === null
				|| body instanceof Error
			) {
				currentResponse.setHeader("content-type", "text/plain; charset=utf-8");
			} else if (body && typeof body === "object") {
				currentResponse.setHeader("content-type", "application/json; charset=utf-8");
			}

			currentResponse.setHeader(informationHeaderKey, currentResponse.information);

			if (currentResponse instanceof HookResponse) {
				currentResponse.setHeader(fromHookHeaderKey, currentResponse.fromHook);
			}

			request.raw.response.writeHead(
				Number(currentResponse.code),
				currentResponse.headers,
			);

			return exit();
		},
		sendResponse({ request, currentResponse, exit }) {
			const { response: rawResponse } = request.raw;

			const body = currentResponse.body;

			if (body instanceof Error) {
				rawResponse.write(
					body.toString(),
				);
			} else if (typeof body === "object") {
				rawResponse.write(
					JSON.stringify(body),
				);
			} else if (typeof body === "string") {
				rawResponse.write(body);
			} else if (
				typeof body === "number"
				|| typeof body === "bigint"
			) {
				rawResponse.write(
					body.toString(),
				);
			}

			rawResponse.end();

			return exit();
		},
	});
}
