import { type HttpServerParams, launchHookServer, type Hub } from "@core/hub";
import { buildRouter } from "@core/router";
import { type Hosts } from "./types/host";
import { type O, type BytesInString, type MaybePromise } from "@duplojs/utils";
import http from "http";
import https from "https";
import { makeNodeHook } from "./hooks";

type WhenServerError = (
	serverRequest: http.IncomingMessage,
	serverResponse: http.ServerResponse,
	error: unknown,
) => MaybePromise<void>;

declare module "@core/hub" {
	interface HttpServerParams {
		readonly host: Hosts;
		readonly port: number;
		readonly maxBodySize: BytesInString | number;
		readonly informationHeaderKey: string;
		readonly fromHookHeaderKey: string;
		readonly http?: http.ServerOptions;
		readonly https?: https.ServerOptions;
		readonly whenServerError?: WhenServerError;
	}
}

export type CreateHttpServerParams = O.PartialKeys<
	HttpServerParams,
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
	};

	const newHub1 = await launchHookServer(
		inputHub.aggregatesHooksHubLifeCycle("beforeServerBuildRoute"),
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

	const server = params.https
		? https.createServer(params.https)
		: http.createServer(params.http ?? {});

	server.addListener(
		"request",
		(serverRequest, serverResponse) => void router
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
				await params.whenServerError?.(
					serverRequest,
					serverResponse,
					error,
				);

				if (!serverResponse.headersSent && !serverResponse.writableEnded) {
					serverResponse.writeHead(500, {
						[httpServerParams.informationHeaderKey]: "critical-server-error",
					});

					serverResponse.write(error?.toString?.() ?? "unknown-server-error");
				}

				if (!serverResponse.writableEnded) {
					serverResponse.end();
				}
			}),
	);

	await launchHookServer(
		newHub2.aggregatesHooksHubLifeCycle("afterStartServer"),
		newHub2,
		httpServerParams,
	);
}
