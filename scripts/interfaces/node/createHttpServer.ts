import { type HttpServerParams, launchHookServer, type Hub, launchHookServerError, serverErrorNextHookFunction, serverErrorExitHookFunction } from "@core/hub";
import { buildRouter } from "@core/router";
import { type Hosts } from "./types/host";
import { type O, type BytesInString, forward } from "@duplojs/utils";
import http from "http";
import https from "https";
import { makeNodeHook } from "./hooks";

declare module "@core/hub" {
	interface HttpServerParams {
		readonly interface: "node";
		readonly host: Hosts;
		readonly port: number;
		readonly maxBodySize: BytesInString | number;
		readonly informationHeaderKey: string;
		readonly fromHookHeaderKey: string;
		readonly http?: http.ServerOptions;
		readonly https?: https.ServerOptions;
	}

	interface HttpServerErrorParams {
		readonly serverRequest: http.IncomingMessage;
		readonly serverResponse: http.ServerResponse;
	}
}

export type CreateHttpServerParams = O.PartialKeys<
	Omit<HttpServerParams, "interface">,
	| "maxBodySize"
	| "informationHeaderKey"
	| "fromHookHeaderKey"
>;

export async function createHttpServer(
	inputHub: Hub,
	params: CreateHttpServerParams,
) {
	const httpServerParams: HttpServerParams = {
		...params,
		maxBodySize: "50mb",
		informationHeaderKey: "information",
		fromHookHeaderKey: "from-hook",
		interface: "node",
	};

	const newHub1 = await launchHookServer(
		inputHub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
		inputHub,
		httpServerParams,
	);

	const router = await buildRouter(
		newHub1.addRouteHooks(
			makeNodeHook(newHub1, httpServerParams),
		),
	);

	const newHub2 = await launchHookServer(
		newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"),
		newHub1,
		httpServerParams,
	);

	if (inputHub.config.environment === "BUILD") {
		process.exit(0);
	}

	const server = params.https
		? https.createServer(params.https)
		: http.createServer(params.http ?? {});

	const serverErrorHooks = newHub1.aggregatesHooksHubLifeCycle("serverError");

	server.addListener(
		"request",
		(serverRequest, serverResponse) => router
			.exec({
				method: serverRequest.method ?? "",
				headers: serverRequest.headers,
				host: serverRequest.headers.host ?? "",
				origin: serverRequest.headers.origin ?? "",
				url: serverRequest.url ?? "",
				raw: {
					request: serverRequest,
					response: serverResponse,
				},
			})
			.catch(async(error: unknown) => {
				await launchHookServerError(serverErrorHooks, {
					error,
					exit: serverErrorExitHookFunction,
					next: serverErrorNextHookFunction,
					serverRequest,
					serverResponse,
				}).catch(forward);

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
			}),
	);

	await new Promise<void>((resolve) => {
		server.listen(
			{
				port: httpServerParams.port,
				host: httpServerParams.host,
			},
			() => void resolve(),
		);
	});

	await launchHookServer(
		newHub2.aggregatesHooksHubLifeCycle("afterStartServer"),
		newHub2,
		httpServerParams,
	);

	return server;
}
