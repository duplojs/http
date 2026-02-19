import { type HandlerStepFunctionParams, handlerStepKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { A, E, unwrap } from "@duplojs/utils";
import { PredictedResponse, ResponseContract } from "@core/response";

export const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(
	handlerStepKind.has,
	(step, { success }) => {
		const {
			responseContract,
			theFunction: handlerFunction,
		} = step.definition;

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

		const response: HandlerStepFunctionParams["response"] = (
			information,
			body,
		) => {
			const currentContract = preparedContractResponse[information];

			if (!currentContract) {
				throw new ResponseContract.Error(information);
			}

			return new PredictedResponse(
				currentContract.code,
				currentContract.information,
				body,
			) as never;
		};

		return success({
			buildedFunction: async(request, floor) => {
				const predictedResponse = await handlerFunction(
					floor,
					{
						request,
						response,
					},
				);

				const currentContract = preparedContractResponse[predictedResponse.information]!;
				const result = currentContract.body.isAsynchronous()
					? await currentContract.body.asyncParse(predictedResponse.body)
					: currentContract.body.parse(predictedResponse.body);

				if (E.isLeft(result)) {
					throw new ResponseContract.Error(
						predictedResponse.information,
						unwrap(result),
					);
				}

				return predictedResponse;
			},
			hooksRouteLifeCycle: [],
		});
	},
);
