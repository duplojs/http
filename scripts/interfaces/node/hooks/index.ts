import { type Hub } from "@core/hub";
import { createHookRouteLifeCycle } from "@core/route";
import { HookResponse, PredictedResponse } from "@core/response";
import { SF } from "@duplojs/server-utils";
import { createReadStream } from "node:fs";
import { createProcessingFormData } from "./formData";
import { createProcessingText } from "./text";
import { type HttpServerParams } from "@core/types";

export function makeNodeHook(hub: Hub, serverParams: HttpServerParams) {
	const informationHeaderKey = serverParams.informationHeaderKey;
	const predictedHeaderKey = serverParams.predictedHeaderKey;
	const fromHookHeaderKey = serverParams.fromHookHeaderKey;
	const isDev = hub.config.environment === "DEV";

	const processingFormData = createProcessingFormData(hub, serverParams);
	const processingText = createProcessingText(hub, serverParams);

	return createHookRouteLifeCycle({
		async parseBody({ request, next }) {
			const contentType = request.headers["content-type"] instanceof Array
				? request.headers["content-type"].join(", ")
				: request.headers["content-type"] ?? "";

			if (contentType.includes("multipart/form-data")) {
				request.body = processingFormData(
					request.raw.request,
				);
			} else if (contentType.includes("text/plain") || !contentType.includes("application/json")) {
				request.body = await processingText(request.raw.request);
			}

			return next();
		},
		beforeSendResponse({ request, currentResponse, next }) {
			if (!currentResponse.headers?.["content-type"]) {
				const body = currentResponse.body;

				if (
					typeof body === "string"
					|| body instanceof Error
				) {
					currentResponse.setHeader("content-type", "text/plain; charset=utf-8");
				} else if (SF.isFileInterface(body)) {
					const filename = body.getName();
					const filenameHeader = filename
						? ` filename="${filename}"`
						: "";
					currentResponse
						.setHeader("content-type", body.getMimeType() ?? "application/octet-stream")
						.setHeader("content-disposition", `attachment;${filenameHeader}`);
				} else if (
					typeof body === "object"
					|| typeof body === "number"
					|| typeof body === "boolean"

				) {
					currentResponse.setHeader("content-type", "application/json; charset=utf-8");
				}
			}

			currentResponse.setHeader(informationHeaderKey, currentResponse.information);

			if (currentResponse instanceof PredictedResponse) {
				currentResponse.setHeader(predictedHeaderKey, "1");
			} else if (currentResponse instanceof HookResponse) {
				currentResponse.setHeader(fromHookHeaderKey, currentResponse.fromHook);
			}

			request.raw.response.writeHead(
				Number(currentResponse.code),
				currentResponse.headers,
			);

			return next();
		},
		async sendResponse({ request, currentResponse, next }) {
			const { response: rawResponse } = request.raw;

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

			return next();
		},
	});
}
