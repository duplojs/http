import { type Hub } from "@core/hub";
import { HookResponse, ServerSentEventsPredictedResponse, PredictedResponse, StreamPredictedResponse, StreamTextPredictedResponse } from "@core/response";
import { createHookRouteLifeCycle } from "@core/route";
import { type HttpServerParams } from "@core/types";
import { SF } from "@duplojs/server-utils";

export function initDefaultHook(
	hub: Hub,
	serverParams: HttpServerParams,
) {
	const informationHeaderKey = serverParams.informationHeaderKey;
	const predictedHeaderKey = serverParams.predictedHeaderKey;
	const fromHookHeaderKey = serverParams.fromHookHeaderKey;
	const isDev = hub.config.environment === "DEV";

	return createHookRouteLifeCycle({
		beforeSendResponse({ currentResponse, next }) {
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
			} else if (currentResponse instanceof ServerSentEventsPredictedResponse) {
				currentResponse.setHeader(predictedHeaderKey, "1");
				currentResponse.setHeader("transfer-encoding", "chunked");
				currentResponse.setHeader("content-type", "text/event-stream");
				currentResponse.setHeader("cache-control", "no-cache");
				currentResponse.setHeader("connection", "keep-alive");
			} else if (currentResponse instanceof StreamPredictedResponse) {
				currentResponse.setHeader(predictedHeaderKey, "1");
				currentResponse.setHeader("transfer-encoding", "chunked");
				currentResponse.setHeader("content-type", "application/octet-stream");
				currentResponse.setHeader("x-duplojs-body-options", "stream");
			} else if (currentResponse instanceof StreamTextPredictedResponse) {
				currentResponse.setHeader(predictedHeaderKey, "1");
				currentResponse.setHeader("transfer-encoding", "chunked");
				currentResponse.setHeader("content-type", "text/plain; charset=utf-8");
				currentResponse.setHeader("x-duplojs-body-options", "stream");
			} else if (currentResponse instanceof HookResponse) {
				currentResponse.setHeader(fromHookHeaderKey, currentResponse.fromHook);
			}

			return next();
		},

	});
}
