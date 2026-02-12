import { FormDataBodyController } from "@core/request";
import { type HttpServerParams } from "@core/types";
import { SF } from "@duplojs/server-utils";
import { A, E, type MaybeArray, Path, stringToBytes, unwrap } from "@duplojs/utils";
import { readRequestFormData } from "./readRequestFormData";
import { createWriteStream } from "node:fs";
import { WrongContentTypeError } from "@core/errors";
import { setAtPath } from "./setAtPath";

export * from "./error";
export * from "./readRequestFormData";
export * from "./setAtPath";

export function createFormDataBodyReaderImplementation(serverParams: HttpServerParams) {
	const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);

	function addValue(
		mapResult: Map<string, MaybeArray<SF.FileInterface | string>>,
		fieldName: string,
		newValue: SF.FileInterface | string,
	) {
		const value = mapResult.get(fieldName);

		if (value === undefined) {
			mapResult.set(fieldName, newValue);
		} else {
			mapResult.set(
				fieldName,
				A.push(A.coalescing(value), newValue),
			);
		}
	}

	return FormDataBodyController.createReaderImplementation(
		async(request, params) => {
			if (!request.headers["content-type"]?.includes("multipart/form-data")) {
				return E.error(
					new WrongContentTypeError(
						"multipart/form-data",
						A.join(A.coalescing(request.headers["content-type"] ?? ""), " "),
					),
				);
			}

			const filesAttache: string[] = [];
			request.filesAttache = filesAttache;

			const result = await readRequestFormData(
				request.raw.request,
				new Map<string, MaybeArray<SF.FileInterface | string>>(),
				{
					maxBodySize: params.bodyMaxSize ?? serverMaxBodySize,
					fileMaxSize: params.fileMaxSize ?? Infinity,
					maxFileQuantity: params.maxFileQuantity,
					mimeType: params.mimeType,
				},
				(header) => {
					const fieldName = header.name;
					if (header.filename) {
						const extension = Path.getExtensionName(header.filename);
						const displayExtension = extension ? `.${extension}` : "";
						const filePath = Path.resolveRelative([
							serverParams.uploadFolder,
							`${Date.now().toString()}${displayExtension}`,
						]);
						filesAttache.push(filePath);

						const currentFile = createWriteStream(
							filePath,
							{
								highWaterMark: request.raw.request.readableHighWaterMark,
							},
						);

						return {
							onReceiveChunk: (chunk) => new Promise(
								(resolve, reject) => void currentFile.write(
									chunk,
									(result) => {
										if (result instanceof Error) {
											return void reject(result);
										}

										return void resolve();
									},
								),
							),
							onEndPart: (valueAccumulator) => {
								currentFile.end();

								addValue(
									valueAccumulator,
									fieldName,
									SF.createFileInterface(currentFile.path.toString()),
								);

								return valueAccumulator;
							},
							onError: () => void currentFile.end(),
						};
					}

					let currentValue = "";
					return {
						onReceiveChunk: (chunk) => {
							currentValue += chunk.toString("utf-8");
						},
						onEndPart: (valueAccumulator) => {
							addValue(
								valueAccumulator,
								fieldName,
								SF.createFileInterface(currentValue),
							);

							return valueAccumulator;
						},
						onError: () => {},
					};
				},
			);

			if (E.isLeft(result)) {
				if (E.hasInformation(result, "server-error")) {
					throw unwrap(result);
				}

				return result;
			}

			if (request.headers["content-type-options"]?.includes("advanced")) {
				const resultObject = {};

				for (const entry of result.entries()) {
					setAtPath(resultObject, entry[0], entry[1]);
				}

				return E.success(resultObject);
			}

			return E.success(Object.fromEntries(result.entries()));
		},
	);
}
