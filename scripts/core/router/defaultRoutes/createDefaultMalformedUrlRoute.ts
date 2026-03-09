import { asserts, asyncPipe, E, isType, unwrap } from "@duplojs/utils";
import { buildRouteFunction, type BuildRouteFunctionParams } from "@core/functionsBuilders";
import type { Hub } from "@core/hub";
import { controlBodyAsText, TextBodyController } from "@core/request";
import { createRoute } from "@core/route";
import { RouterBuildError } from "../buildError";

interface CreateDefaultMalformedUrlRoute {
	hub: Hub;
	buildParams: BuildRouteFunctionParams;
}

export async function createDefaultMalformedUrlRoute(params: CreateDefaultMalformedUrlRoute) {
	const bodyController = controlBodyAsText();
	const bodyReader = unwrap(
		bodyController.tryToCreateReader(
			TextBodyController.createReaderImplementation(
				() => Promise.resolve(
					E.error(new Error("Inaccessible body in malformed url route.")),
				),
			),
		),
	);

	asserts(bodyReader, isType("object"));

	const buildedRoute = await asyncPipe(
		createRoute({
			method: "GET",
			paths: ["/"],
			hooks: [],
			preflightSteps: [],
			steps: [params.hub.malformedUrlHandler],
			metadata: [],
			bodyController,
		}),
		async(route) => {
			const result = await buildRouteFunction(
				route,
				params.buildParams,
			);

			return E.whenIsLeft(
				result,
				(element) => {
					throw new RouterBuildError(route, element);
				},
			);
		},
		unwrap,
	);

	return {
		bodyReader,
		buildedRoute,
	};
}
