import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, type Steps } from "@core/steps";
import { A, DP, hasSomeKinds, O, P, pipe } from "@duplojs/utils";
import { type EntrypointKey } from "./types";
import { type ResponseContract } from "@core/response";

type EntrypointReduceResult = Record<
	EntrypointKey,
	DP.DataParser | Record<string, DP.DataParser>
>;

interface StepsToDataParser {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export interface StepsToDataParserResult {
	entryPointContract: EntrypointReduceResult;
	endpointContract: DP.DataParser[];
}

export function stepsToDataParser(
	steps: readonly Steps[],
	params: StepsToDataParser,
): StepsToDataParserResult {
	const processContracts = pipe(
		steps,
		A.filter(processStepKind.has),
		A.map(
			(element) => stepsToDataParser(
				element.definition.process.definition.steps,
				params,
			),
		),
		O.to({
			entryPointContract: A.map((result) => result.entryPointContract),
			endpointContract: A.flatMap((result) => result.endpointContract),
		}),
	);

	const entryPointContract = pipe(
		steps,
		A.filter(extractStepKind.has),
		A.map((extractStep) => extractStep.definition.shape),
		A.concat(processContracts.entryPointContract),
		A.reduce(
			A.reduceFrom<EntrypointReduceResult>({
				body: {},
				headers: {},
				params: {},
				query: {},
			}),
			({ element: shape, lastValue, next }) => pipe(
				lastValue,
				O.entries,
				A.map(
					([key, accumulatorValue]) => {
						const currentExtractDataParser = shape[key];

						if (DP.dataParserKind.has(accumulatorValue) || !currentExtractDataParser) {
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
				O.transformProperties({
					body: (value) => value ?? {},
					headers: (value) => value ?? {},
					params: (value) => value ?? {},
					query: (value) => value ?? {},
				}),
				next,
			),
		),
	);

	const endpointContract = pipe(
		steps,
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
			({ code, information, body }) => DP.object({
				code: DP.literal(code),
				information: DP.literal(information),
				body,
			}),
		),
		A.concat(processContracts.endpointContract),
	);

	return {
		entryPointContract,
		endpointContract,
	};
}
