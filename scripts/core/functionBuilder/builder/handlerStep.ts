import { type HandlerStepFunctionParams, handlerStepKind } from "@core/steps";
import { createFunctionBuilder } from "../createFunctionBuilder";
import { A, E } from "@duplojs/utils";
import { Response, ResponseContract } from "@core/response";

export const handlerStepFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => handlerStepKind.has(element)
		? support(element)
		: notSupport(),
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

			const result = currentContract.schema.parse(body);

			if (E.isLeft(result)) {
				throw new ResponseContract.Error(information, currentContract);
			}

			return new Response(
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
