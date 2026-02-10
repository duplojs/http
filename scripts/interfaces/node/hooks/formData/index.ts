import { type Hub, type HttpServerParams } from "@core/hub";
import { receiveFormData } from "@core/steps";
import { A, E, type MaybeArray, Path, stringToBytes, unwrap } from "@duplojs/utils";
import type http from "http";
import { readRequestFormData } from "./readRequestFormData";
import { createWriteStream } from "node:fs";
import { createFileInterface, type FileInterface } from "@duplojs/server-utils/file";

export * from "./error";
export * from "./readRequestFormData";

export function createProcessingFormData(
	hub: Hub,
	serverParams: HttpServerParams,
) {
	const isDev = hub.config.environment === "DEV";
	const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);

	function addValue(
		mapResult: Map<string, MaybeArray<FileInterface | string>>,
		fieldName: string,
		newValue: FileInterface | string,
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

	return (request: http.IncomingMessage) => receiveFormData(
		async(params) => {
			const result = await readRequestFormData(
				request,
				new Map<string, MaybeArray<FileInterface | string>>(),
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

						const currentFile = createWriteStream(
							Path.resolveRelative([
								serverParams.uploadFolder,
								`${Date.now().toString()}${displayExtension}`,
							]),
							{
								highWaterMark: request.readableHighWaterMark,
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
									createFileInterface(currentFile.path.toString()),
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
								createFileInterface(currentValue),
							);

							return valueAccumulator;
						},
						onError: () => {},
					};
				},
			);

			if (E.isLeft(result)) {
				throw unwrap(result);
			}

			return E.left("");
		},
	);
}
