import { type Route } from "@core/route";
import { aggregateStepContract } from "./aggregateStepContract";
import { A, DP, innerPipe, O, pipe } from "@duplojs/utils";
import { type ResponseContract } from "@core/response";
import { IgnoreByCodeGeneratorMetadata } from "./metadata";

export interface RouteToDataParserParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export function routeToDataParser(
	route: Route,
	params: RouteToDataParserParams,
): DP.DataParser[] {
	const isIgnore = A.find(
		route.definition.metadata,
		IgnoreByCodeGeneratorMetadata.is,
	);

	if (isIgnore) {
		return [];
	}

	return pipe(
		[
			...route.definition.preflightSteps,
			...route.definition.steps,
		],
		(steps) => aggregateStepContract(steps, {
			defaultExtractContract: params.defaultExtractContract,
		}),
		O.transformProperty(
			"entrypointContract",
			innerPipe(
				O.entries,
				A.select(
					({ element: [key, value], select, skip }) => {
						if (DP.dataParserKind.has(value)) {
							return select(O.entry(key, value));
						}

						if (O.countKeys(value) > 0) {
							return select(
								O.entry(key, DP.object(value)),
							);
						}

						return skip();
					},
				),
				O.fromEntries,
			),
		),
		({ endpointContract, entrypointContract }) => A.map(
			route.definition.paths,
			(path) => DP.object({
				method: DP.literal(route.definition.method),
				path: DP.literal(path),
				...entrypointContract,
				responses: DP.union(endpointContract as never),
			}),
		),
	);
}
