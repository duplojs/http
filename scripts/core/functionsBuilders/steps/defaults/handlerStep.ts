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

			const result = currentContract.body.parse(body);

			if (E.isLeft(result)) {
				throw new ResponseContract.Error(
					information,
					unwrap(result),
				);
			}

			return new PredictedResponse(
				currentContract.code,
				currentContract.information,
				body,
			) as never;
		};

		return success({
			buildedFunction: (request, floor) => handlerFunction(
				floor,
				{
					request,
					response,
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
