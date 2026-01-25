/* eslint-disable @typescript-eslint/prefer-for-of */
import { type HookAfterSendResponse, type HookBeforeRouteExecution, type HookBeforeSendResponse, type HookError, type HookOnConstructRequest, type HookParseBody, type HookRouteLifeCycle, type HookSendResponse, routeKind } from "@core/route";
import { A, E, forward, isType, pipe } from "@duplojs/utils";
import { HookResponse, Response } from "@core/response";
import { type Request } from "@core/request";
import { buildHookAfter, buildHookBefore, buildHookErrorBefore, createHookResponse, exitHookFunction, nextHookFunction } from "./hook";
import { createRouteFunctionBuilder } from "./create";
import { buildStepsFunction } from "../steps";

export const defaultRouteFunctionBuilder = createRouteFunctionBuilder(
	routeKind.has,
	async(
		route,
		{
			success,
			buildStep,
			globalHooksRouteLifeCycle,
		},
	) => {
		const {
			hooks: routeHooks,
			preflightSteps,
			steps,
		} = route.definition;

		const maybeBuildedSteps = await buildStepsFunction(
			steps,
			buildStep,
		);

		if (E.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		const maybeBuildedPreFlightSteps = await buildStepsFunction(
			preflightSteps,
			buildStep,
		);

		if (E.isLeft(maybeBuildedPreFlightSteps)) {
			return maybeBuildedPreFlightSteps;
		}

		const buildedPreFlightSteps = maybeBuildedPreFlightSteps;

		const allHooks = [
			...routeHooks,
			...A.flatMap(
				buildedPreFlightSteps,
				({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
			),
			...A.flatMap(
				buildedSteps,
				({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
			),
			...globalHooksRouteLifeCycle,
		];

		const hookAfterSendResponse: HookAfterSendResponse[] = pipe(
			allHooks,
			A.map(({ afterSendResponse }) => afterSendResponse),
			A.filter(isType("function")),
			forward,
		);
		const hookBeforeRouteExecution: HookBeforeRouteExecution[] = pipe(
			allHooks,
			A.map(({ beforeRouteExecution }) => beforeRouteExecution),
			A.filter(isType("function")),
			forward,
		);
		const hookBeforeSendResponse: HookBeforeSendResponse[] = pipe(
			allHooks,
			A.map(({ beforeSendResponse }) => beforeSendResponse),
			A.filter(isType("function")),
			forward,
		);
		const hookOnConstructRequest: HookOnConstructRequest[] = pipe(
			allHooks,
			A.map(({ onConstructRequest }) => onConstructRequest),
			A.filter(isType("function")),
			forward,
		);
		const hookParseBody: HookParseBody[] = pipe(
			allHooks,
			A.map(({ parseBody }) => parseBody),
			A.filter(isType("function")),
			forward,
		);
		const hookError: HookError[] = pipe(
			allHooks,
			A.map(({ error }) => error),
			A.filter(isType("function")),
			forward,
		);
		const hookSendResponse: HookSendResponse[] = pipe(
			allHooks,
			A.map(({ sendResponse }) => sendResponse),
			A.filter(isType("function")),
			forward,
		);

		const hooks: Required<HookRouteLifeCycle> = {
			afterSendResponse: buildHookAfter(hookAfterSendResponse),
			beforeRouteExecution: buildHookBefore(hookBeforeRouteExecution),
			beforeSendResponse: buildHookAfter(hookBeforeSendResponse),
			onConstructRequest: hookOnConstructRequest.length
				? async(params) => {
					let newRequest = params.request;

					for (let index = 0; index < hookOnConstructRequest.length; index++) {
						newRequest = await hookOnConstructRequest[index]!({
							...params,
							request: newRequest,
						});
					}

					return newRequest;
				}
				: (params) => params.request,
			parseBody: buildHookBefore(hookParseBody),
			error: buildHookErrorBefore(hookError),
			sendResponse: buildHookAfter(hookSendResponse),
		};

		async function routeExecution(request: Request): Promise<Response> {
			try {
				const beforeRouteExecutionResult = await hooks.beforeRouteExecution({
					request,
					exit: exitHookFunction,
					next: nextHookFunction,
					response: createHookResponse("beforeRouteExecution"),
				});

				if (beforeRouteExecutionResult instanceof Response) {
					return beforeRouteExecutionResult;
				}

				let floor = {};

				for (let index = 0; index < buildedPreFlightSteps.length; index++) {
					const result = await buildedPreFlightSteps[index]!.buildedFunction(request, floor);

					if (result instanceof Response) {
						return result;
					}

					floor = result;
				}

				const parseBodyResult = await hooks.parseBody({
					request,
					exit: exitHookFunction,
					next: nextHookFunction,
					response: createHookResponse("parseBody"),
				});

				if (parseBodyResult instanceof Response) {
					return parseBodyResult;
				}

				for (let index = 0; index < buildedSteps.length; index++) {
					const result = await buildedSteps[index]!.buildedFunction(request, floor);

					if (result instanceof Response) {
						return result;
					}

					floor = result;
				}

				return new Response(
					"500",
					"missing-response",
					undefined,
				);
			} catch (error: unknown) {
				const errorResult = await hooks.error({
					request,
					error,
					exit: exitHookFunction,
					next: nextHookFunction,
					response: createHookResponse("error"),
				});

				if (errorResult instanceof HookResponse) {
					return errorResult;
				}

				return new Response(
					"500",
					"server-error",
					error,
				);
			}
		}

		return success(
			async(request) => {
				const currentRequest = await hooks.onConstructRequest({
					request,
					addRequestProperties: (newProperties) => {
						for (const key in newProperties) {
							request[key as never] = newProperties[key] as never;
						}

						return request as never;
					},
				});

				const currentResponse = await routeExecution(currentRequest);

				const afterHookParams = {
					request: currentRequest,
					currentResponse,
					exit: exitHookFunction,
					next: nextHookFunction,
				};

				await hooks.beforeSendResponse(afterHookParams);

				await hooks.sendResponse(afterHookParams);

				await hooks.afterSendResponse(afterHookParams);
			},
		);
	},
);
