import { FormDataBodyController } from "@core/request";
import { type HttpServerParams } from "@core/types";
import { SF } from "@duplojs/server-utils";
import { A, E, type MaybeArray, O, Path, stringToBytes, TheFormData, unwrap } from "@duplojs/utils";
import { readRequestFormData } from "./readRequestFormData";
import { createWriteStream } from "node:fs";
import { randomUUID } from "node:crypto";
import { WrongContentTypeError } from "@core/errors";
import { once } from "node:events";

export * from "./error";
export * from "./readRequestFormData";

export function createFormDataBodyReaderImplementation(serverParams: HttpServerParams) {
	const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);

	async function createUploadFile(extension: string, highWaterMark?: number) {
		let remainingAttempts = 5;

		do {
			const filePath = Path.resolveRelative([
				serverParams.uploadFolder,
				`${randomUUID()}${extension}`,
			]);

			const stream = createWriteStream(
				filePath,
				{
					flags: "wx",
					autoClose: true,
					highWaterMark,
				},
			);

			try {
				await once(stream, "open");

				return stream;
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "EEXIST" || --remainingAttempts === 0) {
					throw error;
				}
			}
		} while (true);
	}

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
					maxBufferSize: params.maxBufferSize,
					maxKeyLength: params.maxKeyLength,
				},
				async(header) => {
					const fieldName = header.name;
					if (header.filename) {
						const extension = Path.getExtensionName(header.filename);
						const displayExtension = extension ? `.${extension}` : "";
						const currentFile = await createUploadFile(
							displayExtension,
							request.raw.request.readableHighWaterMark,
						);
						filesAttache.push(currentFile.path.toString());

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
								currentValue,
							);

							return valueAccumulator;
						},
						onError: null,
					};
				},
			);

			if (E.isLeft(result)) {
				// mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
				request.raw.response.setHeader("Connection", "close");
				if (E.hasInformation(result, "server-error")) {
					throw unwrap(result);
				}

				return result;
			}

			if (request.headers["content-type-options"]?.includes("advanced")) {
				return E.success(
					TheFormData.fromEntries(result.entries(), params.maxIndexArray),
				);
			}

			return E.success(O.fromEntries(result.entries()));
		},
	);
}
