import { type Route } from "@core/route";
import { aggregateStepContract } from "./aggregateStepContract";
import { A, DP, E, innerPipe, O, P, pipe, S, unwrap } from "@duplojs/utils";
import { type ResponseContract } from "@core/response";
import { IgnoreByCodeGeneratorMetadata } from "./metadata";
import { FormDataBodyController } from "@core/request";
import { factory } from "typescript";
import { type TransformerBuildFunction } from "@duplojs/data-parser-tools/toTypescript";

export interface RouteToDataParserParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export const bodyAsFormData: TransformerBuildFunction = (dataParser, { transformer, success, addImport }) => {
	const result = transformer(dataParser);

	if (E.isLeft(result)) {
		return result;
	}

	addImport("@duplojs/utils", "TheFormData");

	return success(
		factory.createTypeReferenceNode(
			"TheFormData",
			[unwrap(result)],
		),
	);
};

export const convertRoutePath = (path: string) => pipe(
	path,
	S.split("*"),
	A.flatMap(
		(element, { index, self }) => A.isLastIndex(self, index)
			? element
			: [element, DP.string()],
	),
	P.when(
		A.minElements(2),
		(template) => DP.templateLiteral(template),
	),
	P.otherwise(() => DP.literal(path)),
);

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
				path: convertRoutePath(path),
				...entrypointContract,
				...(
					entrypointContract.body && FormDataBodyController.is(route.definition.bodyController)
						? {
							body: entrypointContract
								.body
								.addOverrideTypescriptTransformer(bodyAsFormData),
						}
						: {}
				),
				responses: DP.union(endpointContract as never),
			}),
		),
	);
}
