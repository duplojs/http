import { type CutStepFunctionParams, cutStepKind, cutStepOutputKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { A, E, unwrap, wrapValue } from "@duplojs/utils";
import { PredictedResponse, ResponseContract } from "@core/response";

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
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new PredictedResponse(
				currentContract.code,
				currentContract.information,
				body,
			) as never;
		};

		return success({
			buildedFunction: async(request, floor) => {
				const cutResult = await cutFunction(
					floor,
					{
						request,
						output,
						response,
					},
				);

				if (cutResult instanceof PredictedResponse) {
					const currentContract = preparedContractResponse[cutResult.information]!;
					const resultBody = currentContract.body.isAsynchronous()
						? await currentContract.body.asyncParse(cutResult.body)
						: currentContract.body.parse(cutResult.body);

					if (E.isLeft(resultBody)) {
						throw new ResponseContract.Error(
							cutResult.information,
							unwrap(resultBody),
						);
					}

					return cutResult;
				}

				return {
					...floor,
					...unwrap(cutResult),
				};
			},
			hooksRouteLifeCycle: [],
		});
	},
);
