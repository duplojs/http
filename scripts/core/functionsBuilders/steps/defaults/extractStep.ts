import { type ExtractShape, extractStepKind } from "@core/steps";
import { A, DP, E, forward, innerPipe, isType, justReturn, type MaybePromise, O, P, pipe, unwrap } from "@duplojs/utils";
import { type Request } from "@core/request";
import { PredictedResponse } from "@core/response";
import { type Floor } from "@core/floor";
import { createStepFunctionBuilder } from "../create";
import { type DataParser } from "@duplojs/utils/dataParser";

type Extractor = (request: Request, floor: Floor) => MaybePromise<PredictedResponse | Floor>;

export const defaultExtractStepFunctionBuilder = createStepFunctionBuilder(
	extractStepKind.has,
	(step, { success, environment, defaultExtractContract }) => {
		const {
			shape,
			responseContract: stepResponseContract,
		} = step.definition;

		const responseContract = stepResponseContract ?? defaultExtractContract;

		function createExtractor(
			parser: DataParser,
			key: keyof ExtractShape,
			subKey: string | undefined,
		): Extractor {
			const createResponse = environment === "DEV"
				? (result: unknown) => new PredictedResponse(
					responseContract.code,
					responseContract.information,
					result,
				)
				: () => new PredictedResponse(responseContract.code, responseContract.information, undefined);
			const setHeader = subKey === undefined || key === "body"
				? (response: PredictedResponse) => response.setHeader("extract-key", `request.${key}`)
				: (response: PredictedResponse) => response.setHeader("extract-key", `request.${key}.${subKey}`);
			const getResponse = (result: unknown) => setHeader(createResponse(result));
			const treatResult = (result: E.Left | E.Right, floor: Floor) => E.isLeft(result)
				? getResponse(unwrap(result))
				: {
					...floor,
					[subKey ?? key]: unwrap(result),
				};
			const getValue = typeof subKey === "string"
				? (value: unknown) => value?.[subKey as never]
				: forward;

			if (key === "body") {
				const parseFunction = parser.isAsynchronous()
					? parser.asyncParse
					: parser.parse;
				return async(request: Request, floor: Floor) => {
					const bodyResult = await request.getBody();
					if (E.isLeft(bodyResult)) {
						return treatResult(bodyResult, floor);
					}
					const result = await parseFunction(getValue(unwrap(bodyResult)));
					return treatResult(result, floor);
				};
			}

			if (parser.isAsynchronous()) {
				const parseFunction = parser.asyncParse;
				return async(request: Request, floor: Floor) => {
					const result = await parseFunction(getValue(request[key]));
					return treatResult(result, floor);
				};
			}

			const parseFunction = parser.parse;
			return (request: Request, floor: Floor) => {
				const result = parseFunction(getValue(request[key]));
				return treatResult(result, floor);
			};
		}

		const extractors = A.reduce(
			O.entries(shape),
			A.reduceFrom<Extractor[]>([]),
			({
				lastValue,
				element: [key, value],
				next,
			}) => pipe(
				value,
				P.when(
					DP.dataParserKind.has,
					(value) => A.push(
						lastValue,
						createExtractor(
							value,
							key,
							undefined,
						),
					),
				),
				P.otherwise(
					(value) => pipe(
						value,
						P.when(
							isType("undefined"),
							justReturn(lastValue),
						),
						P.otherwise(
							innerPipe(
								O.entries,
								A.map(
									([subKey, subValue]) => createExtractor(
										subValue,
										key,
										subKey,
									),
								),
								(subExtractor) => A.concat(lastValue, subExtractor),
							),
						),
					),
				),
				next,
			),
		);

		return success({
			buildedFunction: async(request, floor) => {
				let newFloor = floor;

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < extractors.length; index++) {
					const result = await extractors[index]!(request, newFloor);

					if (result instanceof PredictedResponse) {
						return result;
					}

					newFloor = result;
				}

				return newFloor;
			},
			hooksRouteLifeCycle: [],
		});
	},
);
