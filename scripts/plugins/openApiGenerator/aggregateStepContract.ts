import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, stepIdentifier, type Steps } from "@core/steps";
import { A, DP, hasSomeKinds, O, P, pipe } from "@duplojs/utils";
import type { ResponseContract } from "@core/response";
import type { EntrypointKey } from "./types";
import { IgnoreByOpenApiGeneratorMetadata } from "./metadata";

export type EntrypointReduceResult = Record<
	EntrypointKey,
	DP.DataParser | Record<string, DP.DataParser>
>;

export interface AggregateStepsResult {
	entrypointContract: EntrypointReduceResult;
	endpointContract: ResponseContract.Contracts[];
}

export interface AggregateStepsParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export function aggregateStepContract(
	steps: readonly Steps[],
	params: AggregateStepsParams,
): AggregateStepsResult {
	const filteredStep = A.filter(
		steps,
		(step) => A.find(
			step.definition.metadata,
			IgnoreByOpenApiGeneratorMetadata.is,
		) === undefined,
	);

	const processContracts = pipe(
		filteredStep,
		A.filter(stepIdentifier(processStepKind)),
		A.filter(
			(step) => A.find(
				step.definition.process.definition.metadata,
				IgnoreByOpenApiGeneratorMetadata.is,
			) === undefined,
		),
		A.map(
			(element) => aggregateStepContract(
				element.definition.process.definition.steps,
				params,
			),
		),
		O.to({
			entrypointContract: A.map((result) => result.entrypointContract),
			endpointContract: A.flatMap((result) => result.endpointContract),
		}),
	);

	const entrypointContract = pipe(
		filteredStep,
		A.filter(extractStepKind.has),
		A.map((extractStep) => extractStep.definition.shape),
		A.concat(processContracts.entrypointContract),
		A.reduce(
			A.reduceFrom<EntrypointReduceResult>({
				body: {},
				headers: {},
				params: {},
				query: {},
			}),
			({ element: shape, lastValue, nextWithObject }) => pipe(
				lastValue,
				O.entries,
				A.map(
					([key, accumulatorValue]) => {
						const currentExtractDataParser = shape[key];

						if (
							DP.dataParserKind.has(accumulatorValue)
							|| !currentExtractDataParser
							|| (
								!DP.dataParserKind.has(accumulatorValue)
								&& O.countKeys(accumulatorValue) > 1
								&& DP.dataParserKind.has(currentExtractDataParser)
								&& !DP.objectKind.has(currentExtractDataParser)
							)
						) {
							return O.entry(key, accumulatorValue);
						}

						if (!DP.dataParserKind.has(currentExtractDataParser)) {
							return O.entry(
								key,
								{
									...accumulatorValue,
									...currentExtractDataParser,
								},
							);
						}

						if (DP.identifier(currentExtractDataParser, DP.objectKind)) {
							return O.entry(
								key,
								{
									...accumulatorValue,
									...currentExtractDataParser.definition.shape,
								},
							);
						}

						return O.entry(key, currentExtractDataParser);
					},
				),
				O.fromEntries,
				(object) => nextWithObject(lastValue, object),
			),
		),
	);

	const endpointContract = pipe(
		filteredStep,
		A.flatMap(
			(step) => P.match(step)
				.when(
					processStepKind.has,
					() => [],
				)
				.when(
					extractStepKind.has,
					({ definition }) => definition.responseContract ?? params.defaultExtractContract,
				)
				.when(
					presetCheckerStepKind.has,
					({ definition }) => definition.presetChecker.definition.responseContract,
				)
				.when(
					hasSomeKinds([
						checkerStepKind,
						cutStepKind,
						handlerStepKind,
					]),
					({ definition }) => definition.responseContract,
				)
				.exhaustive(),
		),
		A.concat(processContracts.endpointContract),
	);

	return {
		entrypointContract,
		endpointContract,
	};
}
