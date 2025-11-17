/* eslint-disable @typescript-eslint/prefer-for-of */
import { type HookAfterSendResponse, type HookBeforeRouteExecution, type HookBeforeSendResponse, type HookError, type HookOnConstructRequest, type HookParseBody, HookResponse, type HookRouteLifeCycle, type HookSendResponse, routeKind } from "@core/route";
import { createFunctionBuilder } from "../../create";
import { A, E, forward, isType, pipe } from "@duplojs/utils";
import { Response } from "@core/response";
import { type Request } from "@core/request";
import { buildSteps } from "./step";
import { buildHookAfter, buildHookBefore, createHookResponse, exitHookFunction, nextHookFunction } from "./hook";

export * from "./hook";
export * from "./step";

export const routeFunctionBuilder = createFunctionBuilder(
	(element, { support, notSupport }) => routeKind.has(element)
		? support(element)
		: notSupport(),
	async(
		route,
		{
			success,
			buildElement,
			globalHooksRouteLifeCycle,
		},
	) => {
		const {
			hooks: routeHooks,
			preflightSteps: preflightSteps,
			steps,
		} = route.definition;

		const maybeBuildedSteps = await buildSteps(
			steps,
			buildElement,
		);

		if (E.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		const maybeBuildedPreFlightSteps = await buildSteps(
			preflightSteps,
			buildElement,
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
			error: buildHookBefore(hookError),
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
