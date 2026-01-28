import { type HttpServerParams, type Hub } from "@core/hub";
import { type RouterInitializationData } from "@core/router";
import { type Hosts } from "./types/host";
import { type BytesInString, O } from "@duplojs/utils";
import http from "http";
import https from "https";
import { makeNodeHook } from "./hooks";
import { implementHttpServer } from "@core/implementHttpServer";

declare module "@core/hub" {
	interface HttpServerParams {
		readonly interface: "node";
		readonly host: Hosts;
		readonly port: number;
		readonly maxBodySize: BytesInString | number;
		readonly informationHeaderKey: string;
		readonly predictedHeaderKey: string;
		readonly fromHookHeaderKey: string;
		readonly http?: http.ServerOptions;
		readonly https?: https.ServerOptions;
	}
}

export type CreateHttpServerParams = O.PartialKeys<
	Omit<HttpServerParams, "interface">,
	| "maxBodySize"
	| "informationHeaderKey"
	| "predictedHeaderKey"
	| "fromHookHeaderKey"
>;

export function createHttpServer(
	inputHub: Hub,
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
		},
		params,
	);

	const hooks = makeNodeHook(inputHub, httpServerParams);

	const hub = inputHub.addRouteHooks(hooks);

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
