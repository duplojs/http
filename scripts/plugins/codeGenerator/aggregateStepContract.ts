import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, stepIdentifier, type Steps } from "@core/steps";
import { A, DP, hasSomeKinds, innerPipe, O, P, pipe } from "@duplojs/utils";
import { type EntrypointKey } from "./types";
import { ResponseContract } from "@core/response";
import { IgnoreByCodeGeneratorMetadata } from "./metadata";
import { factory } from "typescript";

type EntrypointReduceResult = Record<
	EntrypointKey,
	DP.DataParser | Record<string, DP.DataParser>
>;

export interface StepsToDataParserParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export interface StepsToDataParserResult {
	entrypointContract: EntrypointReduceResult;
	endpointContract: DP.DataParser[];
}

const defaultFluxStreamSchema = DP.unknown().setOverrideTypescriptTransformer(
	factory.createTypeReferenceNode(
		"Uint8Array",
		[factory.createTypeReferenceNode("ArrayBuffer")],
	),
);

export function aggregateStepContract(
	steps: readonly Steps[],
	params: StepsToDataParserParams,
): StepsToDataParserResult {
	const filteredStep = A.filter(
		steps,
		(step) => A.find(
			step.definition.metadata,
			IgnoreByCodeGeneratorMetadata.is,
		) === undefined,
	);

	const processContracts = pipe(
		filteredStep,
		A.filter(stepIdentifier(processStepKind)),
		A.filter(
			(step) => A.find(
				step.definition.process.definition.metadata,
				IgnoreByCodeGeneratorMetadata.is,
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
		A.map(
			innerPipe(
				P.when(
					ResponseContract.contractKind.has,
					({ code, information, body }) => DP.object({
						code: DP.literal(code),
						information: DP.literal(information),
						body,
					}),
				),
				P.when(
					ResponseContract.serverSentEventsContractKind.has,
					({ code, information, body, events }) => DP.object({
						code: DP.literal(code),
						information: DP.literal(information),
						body,
						events: DP.object(events),
					}),
				),
				P.when(
					ResponseContract.streamContractKind.has,
					({ code, information, body }) => DP.object({
						code: DP.literal(code),
						information: DP.literal(information),
						body,
						flux: defaultFluxStreamSchema,
					}),
				),
				P.when(
					ResponseContract.streamTextContractKind.has,
					({ code, information, body, flux }) => DP.object({
						code: DP.literal(code),
						information: DP.literal(information),
						body,
						flux,
					}),
				),
				P.exhaustive,
			),
		),
		A.concat(processContracts.endpointContract),
	);

	return {
		entrypointContract,
		endpointContract,
	};
}
