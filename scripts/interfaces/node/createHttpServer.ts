import { type Hub } from "@core/hub";
import { type RouterInitializationData } from "@core/router";
import http from "http";
import https from "https";
import { initNodeHook } from "./hooks";
import { implementHttpServer } from "@core/implementHttpServer";
import { O } from "@duplojs/utils";
import { type HttpServerParams } from "@core/types";
import { initDefaultHook } from "@core/defaultHooks";
import { createFormDataBodyReaderImplementation, createTextBodyReaderImplementation } from "./bodyReaders";

declare module "@core/types" {
	interface HttpServerParams {
		readonly interface: "node";
		readonly http?: http.ServerOptions;
		readonly https?: https.ServerOptions;
	}

	interface HostCustom {
		"::": true;
		"0.0.0.0": true;
		localhost: true;
		"127.0.0.1": true;
		"::1": true;
	}
}

export type CreateHttpServerParams = O.PartialKeys<
	Omit<HttpServerParams, "interface">,
	| "maxBodySize"
	| "informationHeaderKey"
	| "predictedHeaderKey"
	| "fromHookHeaderKey"
	| "uploadFolder"
>;

export function createHttpServer(
	hub: Hub,
	params: CreateHttpServerParams,
) {
	const httpServerParams: HttpServerParams = O.override<HttpServerParams>(
		{
			host: "localhost",
			port: 80,
			maxBodySize: "50mb",
			informationHeaderKey: "information",
			predictedHeaderKey: "predicted",
			fromHookHeaderKey: "from-hook",
			interface: "node",
			uploadFolder: "./upload",
		},
		params,
	);

	hub.addBodyReaderImplementation([
		createTextBodyReaderImplementation(httpServerParams),
		createFormDataBodyReaderImplementation(httpServerParams),
	]);
	hub.addRouteHooks([
		initDefaultHook(hub, httpServerParams),
		initNodeHook(hub, httpServerParams),
	]);

	function whenUncaughtError(
		error: unknown,
		routerInitializationData: RouterInitializationData,
	) {
		const serverResponse = routerInitializationData.raw.response;

		if (!serverResponse.headersSent && !serverResponse.writableEnded) {
			serverResponse.writeHead(500, {
				[httpServerParams.informationHeaderKey]: "critical-server-error",
			});

			const maybeError = error?.toString?.();

			serverResponse.write(
				typeof maybeError === "string"
					? maybeError
					: "unknown-server-error",
			);
		}

		if (!serverResponse.writableEnded) {
			serverResponse.end();
		}
	}

	return implementHttpServer(
		{
			hub,
			httpServerParams,
		},
		({ httpServerParams, execRouteSystem }) => {
			const server = httpServerParams.https
				? https.createServer(httpServerParams.https)
				: http.createServer(httpServerParams.http ?? {});

			server.addListener(
				"request",
				(serverRequest, serverResponse) => execRouteSystem(
					{
						method: serverRequest.method ?? "",
						headers: serverRequest.headers,
						host: serverRequest.headers.host ?? "",
						origin: serverRequest.headers.origin ?? "",
						url: serverRequest.url ?? "",
						raw: {
							request: serverRequest,
							response: serverResponse,
						},
					},
					whenUncaughtError,
				),
			);

			if (hub.config.environment === "BUILD") {
				return server;
			}

			return new Promise<typeof server>((resolve) => {
				server.listen(
					{
						port: httpServerParams.port,
						host: httpServerParams.host,
					},
					() => void resolve(server),
				);
			});
		},
	);
}
