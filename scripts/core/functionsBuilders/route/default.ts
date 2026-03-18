/* eslint-disable @typescript-eslint/prefer-for-of */
import { type HookAfterSendResponse, type HookBeforeRouteExecution, type HookBeforeSendResponse, type HookError, type HookRouteLifeCycle, type HookSendResponse, routeKind } from "@core/route";
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
			beforeRouteExecution: buildHookBefore(hookBeforeRouteExecution),
			afterSendResponse: buildHookAfter(hookAfterSendResponse),
			beforeSendResponse: buildHookAfter(hookBeforeSendResponse),
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
				const currentResponse = await routeExecution(request);

				const afterHookParams = {
					request,
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
