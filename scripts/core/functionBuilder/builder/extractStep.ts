import { extractStepKind } from "@core/steps";
import { createFunctionBuilder } from "../createFunctionBuilder";
import { A, DP, E, innerPipe, isType, justReturn, O, P, pipe, unwrap } from "@duplojs/utils";
import { type Request } from "@core/request";
import { Response, ResponseContract } from "@core/response";
import { type Floor } from "@core/floor";

type Extractor = (request: Request, floor: Floor) => Response | Floor;

export const extractStepFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => extractStepKind.has(element)
		? support(element)
		: notSupport(),
	(step, { success, environment }) => {
		const {
			shape,
			responseContract: stepResponseContract,
		} = step.definition;

		const responseContract = stepResponseContract ?? ResponseContract
			.unprocessableContent(
				"extract-error",
			);

		const getResponse = environment === "DEV"
			? (
				result: E.EitherError<DP.DataParserError>,
				key: string,
				subKey?: string,
			) => {
				const response = new Response(
					responseContract.code,
					responseContract.information,
					unwrap(result),
				);

				return subKey === undefined
					? response.setHeader("extract-key", `request.${key}`)
					: response.setHeader("extract-key", `request.${key}.${subKey}`);
			}
			: (
				_result: E.EitherError<DP.DataParserError>,
				key: string,
				subKey?: string,
			) => {
				const response = new Response(
					responseContract.code,
					responseContract.information,
					undefined,
				);

				return subKey === undefined
					? response.setHeader("extract-key", `request.${key}`)
					: response.setHeader("extract-key", `request.${key}.${subKey}`);
			};

		function treatResult(
			result: E.EitherError<DP.DataParserError> | E.EitherSuccess<unknown>,
			floor: Floor,
			key: string,
			subKey?: string,
		) {
			if (E.isLeft(result)) {
				return getResponse(result, key, subKey);
			}

			return {
				...floor,
				[subKey ?? key]: unwrap(result),
			};
		}

		const extractors = A.reduce(
			O.entries(shape),
			A.reduceFrom<Extractor[]>([]),
			({ lastValue, element: [key, value], next }) => next(
				DP.dataParserKind.has(value)
					? A.push(
						lastValue,
						(request, floor) => treatResult(
							value.parse(request[key]),
							floor,
							key,
						),
					)
					: pipe(
						value,
						P.when(
							isType("undefined"),
							justReturn(lastValue),
						),
						P.otherwise(
							innerPipe(
								O.entries,
								A.map(
									([subKey, subValue]): Extractor => (
										(request, floor) => treatResult(
											subValue.parse(request[key]?.[subKey as never]),
											floor,
											key,
											subKey,
										)
									),
								),
								(subExtractor) => A.concat(lastValue, subExtractor),
							),
						),
					),
			),
		);

		return success({
			buildedFunction: (request, floor) => {
				let newFloor = floor;

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < extractors.length; index++) {
					const result = extractors[index]!(request, newFloor);

					if (result instanceof Response) {
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
