import { type HandlerStepFunctionParams, handlerStepKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { A, E, unwrap } from "@duplojs/utils";
import { PredictedResponse, ResponseContract, ServerSentEventsPredictedResponse } from "@core/response";

export const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(
	handlerStepKind.has,
	(step, { success }) => {
		const {
			responseContract,
			theFunction: handlerFunction,
		} = step.definition;

		const preparedContractResponse = A.reduce(
			A.coalescing(responseContract),
			A.reduceFrom<
				Record<
					string,
					ResponseContract.Contract | ResponseContract.ServerSentEventsContract
				>
			>({}),
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

			if (
				!currentContract
				|| !ResponseContract.contractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
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
				information,
				body,
			) as never;
		};

		const serverSentEventsResponse: HandlerStepFunctionParams["serverSentEventsResponse"] = (
			information,
			startSendingEvents,
		) => {
			const currentContract = preparedContractResponse[information];

			if (
				!currentContract
				|| !ResponseContract.serverSentEventsContractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new ServerSentEventsPredictedResponse(
				currentContract.code,
				information,
				(params) => startSendingEvents({
					...params,
					send: (event, data, sendParams) => {
						const dataParser = currentContract.events[event];

						if (!dataParser) {
							console.error(new ResponseContract.Error(information, `Event '${event}' not found.`));
							return;
						}

						const result = dataParser.parse(data);

						if (E.isLeft(result)) {
							console.error(new ResponseContract.Error(information, unwrap(result)));
							return;
						}

						params.send(event, data, sendParams);
					},
				}),
			) as never;
		};

		return success({
			buildedFunction: async(request, floor) => handlerFunction(
				floor,
				{
					request,
					response,
					serverSentEventsResponse,
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
