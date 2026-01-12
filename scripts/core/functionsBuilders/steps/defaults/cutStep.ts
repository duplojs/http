import { type CutStepDefinition, type CutStepFunctionParams, cutStepKind, cutStepOutputKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { A, E, unwrap, wrapValue } from "@duplojs/utils";
import { Response, ResponseContract } from "@core/response";
import { type Floor } from "@core/floor";

export const defaultCutStepFunctionBuilder = createStepFunctionBuilder(
	cutStepKind.has,
	(step, { success }) => {
		const {
			responseContract,
			theFunction: cutFunction,
		} = step.definition;

		const output: CutStepFunctionParams["output"] = (
			data,
		) => cutStepOutputKind.setTo(
			wrapValue(data ?? {} as never),
		);

		const preparedContractResponse = A.reduce(
			A.coalescing(responseContract),
			A.reduceFrom<Record<string, ResponseContract.Contract>>({}),
			({ element, lastValue, nextWithObject }) => nextWithObject(
				lastValue,
				{
					[element.information]: element,
				},
			),
		);

		const response: CutStepFunctionParams["response"] = (
			information,
			body,
		) => {
			const currentContract = preparedContractResponse[information];

			if (!currentContract) {
				throw new ResponseContract.Error(information);
			}

			const result = currentContract.body.parse(body);

			if (E.isLeft(result)) {
				throw new ResponseContract.Error(
					information,
					unwrap(result),
				);
			}

			return new Response(
				currentContract.code,
				currentContract.information,
				body,
			) as never;
		};

		function treatResult(
			result: Awaited<ReturnType<CutStepDefinition["theFunction"]>>,
			floor: Floor,
		) {
			if (cutStepOutputKind.has(result)) {
				return {
					...floor,
					...unwrap(result),
				};
			}

			return result;
		}

		return success({
			buildedFunction: (request, floor) => {
				const result = cutFunction(
					floor,
					{
						request,
						output,
						response,
					},
				);

				if (result instanceof Promise) {
					return result.then(
						(awaitedResult) => treatResult(awaitedResult, floor),
					);
				}

				return treatResult(result, floor);
			},
			hooksRouteLifeCycle: [],
		});
	},
);
