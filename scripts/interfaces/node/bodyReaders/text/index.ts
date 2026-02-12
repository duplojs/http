import { TextBodyController } from "@core/request";
import { readRequestText } from "./readRequestText";
import { A, E, type Json, stringToBytes, unwrap } from "@duplojs/utils";
import { type HttpServerParams } from "@core/types";
import { ParseJsonError } from "./parseJsonError";
import { WrongContentTypeError } from "@core/errors";

export * from "./parseJsonError";
export * from "./readRequestText";

export function createTextBodyReaderImplementation(serverParams: HttpServerParams) {
	const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);

	return TextBodyController.createReaderImplementation(
		async(request, params) => {
			if (
				!request.headers["content-type"]?.includes("application/json")
				&& !request.headers["content-type"]?.includes("text/plain")
			) {
				return E.error(
					new WrongContentTypeError(
						"application/json or text/plain",
						A.join(A.coalescing(request.headers["content-type"] ?? ""), " "),
					),
				);
			}

			const result = await readRequestText(
				request.raw.request,
				{ maxBodySize: params.bodyMaxSize ?? serverMaxBodySize },
				(result) => {
					if (request.headers["content-type"]?.includes("application/json")) {
						try {
							return E.success(
								JSON.parse(result) as Json,
							);
						} catch (error) {
							return E.error(
								new ParseJsonError(result, error),
							);
						}
					}

					return E.success(result);
				},
			);

			if (E.hasInformation(result, "server-error")) {
				throw unwrap(result);
			}

			return result;
		},
	);
}
