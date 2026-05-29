import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, type Steps } from "@core/steps";
import { DataParserFinder } from "@duplojs/data-parser-tools";
import { A, DP, forward, hasSomeKinds, innerPipe, O, P, pipe, whenNot } from "@duplojs/utils";

export type IdentifiedDataParser = (
	& DP.DataParser
	& { definition: { identifier: string } }
);

export function dataParserHasIdentifier(
	dataParser: DP.DataParser,
): dataParser is IdentifiedDataParser {
	return !!dataParser.definition.identifier;
}

export interface findIdentifiedDataParserInStepsParams {
	readonly ignoreDataParser: Set<DP.DataParser>;
}

export function findIdentifiedDataParserInSteps(
	steps: readonly Steps[],
	params: findIdentifiedDataParserInStepsParams,
): IdentifiedDataParser[] {
	return pipe(
		steps,
		A.flatMap(
			innerPipe(
				P.when(
					extractStepKind.has,
					(extractStep) => pipe(
						extractStep.definition.shape,
						O.values,
						A.flatMap(
							innerPipe(
								whenNot(
									DP.dataParserKind.has,
									O.values,
								),
							),
						),
						A.concat(
							extractStep.definition.responseContract?.body
								? [extractStep.definition.responseContract?.body]
								: [],
						),
					),
				),
				P.when(
					processStepKind.has,
					forward,
				),
				P.when(
					presetCheckerStepKind.has,
					(step) => [step.definition.presetChecker.definition.responseContract.body],
				),
				P.when(
					hasSomeKinds([
						checkerStepKind,
						cutStepKind,
						handlerStepKind,
					]),
					(step) => pipe(
						step.definition.responseContract,
						A.coalescing,
						A.map(
							({ body }) => body,
						),
					),
				),
				P.exhaustive,
			),
		),
		A.flatMap(
			innerPipe(
				P.when(
					processStepKind.has,
					(processStep) => findIdentifiedDataParserInSteps(
						processStep.definition.process.definition.steps,
						params,
					),
				),
				P.when(
					DP.dataParserKind.has,
					(dataParser) => DataParserFinder.dataParserFinder(
						dataParser,
						dataParserHasIdentifier,
						{
							researchers: DataParserFinder.defaultResearchers,
							ignore: params.ignoreDataParser,
						},
					),
				),
				P.exhaustive,
			),
		),
	);
}
