import { launchHookServer, type Hub } from "@core/hub";
import { buildRouter } from "@core/router";
import { type Hosts } from "./types/host";
import { A, asyncPipe, isType, type MaybePromise, pipe } from "@duplojs/utils";
import http from "http";
import https from "https";

type WhenServerError = (
	serverRequest: http.IncomingMessage,
	serverResponse: http.ServerResponse,
	error: unknown,
) => MaybePromise<void>;

export interface CreateHttpServerParams {
	host: Hosts;
	port: number;
	http?: http.ServerOptions;
	https?: https.ServerOptions;
	whenServerError?: WhenServerError;
}

export function createHttpServer(
	inputHub: Hub,
	params: CreateHttpServerParams,
) {
	return asyncPipe(
		{ hub: inputHub },
		({ hub }) => launchHookServer(
			pipe(
				hub.definitions,
				A.flatMap(
					({ hooksHubLifeCycle }) => hooksHubLifeCycle ?? [],
				),
				A.map(
					({ beforeServerBuildRoute }) => beforeServerBuildRoute,
				),
				A.filter(isType("function")),
			),
			hub,
		).then((newHub) => ({ hub: newHub })),
		({ hub }) => buildRouter(hub)
			.then((router) => ({
				router,
				hub,
			})),
		({ hub, router }) => launchHookServer(
			pipe(
				hub.definitions,
				A.flatMap(
					({ hooksHubLifeCycle }) => hooksHubLifeCycle ?? [],
				),
				A.map(
					({ beforeStartServer }) => beforeStartServer,
				),
				A.filter(isType("function")),
			),
			hub,
		).then((newHub) => ({
			hub: newHub,
			router,
		})),
		({ router, hub }) => {
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
							serverResponse.writeHead(500, {});

							serverResponse.write(error?.toString?.() ?? "unknown-server-error");
						}

						if (!serverResponse.writableEnded) {
							serverResponse.end();
						}
					}),
			);

			return { hub };
		},
		({ hub }) => launchHookServer(
			pipe(
				hub.definitions,
				A.flatMap(
					({ hooksHubLifeCycle }) => hooksHubLifeCycle ?? [],
				),
				A.map(
					({ afterStartServer }) => afterStartServer,
				),
				A.filter(isType("function")),
			),
			hub,
		),
	);
}
