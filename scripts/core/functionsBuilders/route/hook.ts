/* eslint-disable @typescript-eslint/prefer-for-of */
import { HookResponse } from "@core/response";
import { type HookAfterSendResponse, type HookBeforeRouteExecution, type HookBeforeSendResponse, type HookError, hookRouteExitKind, type HookRouteLifeCycle, hookRouteNextKind, type HookSendResponse, type RouteHookErrorParams, type RouteHookParams, type RouteHookParamsAfter } from "@core/route";

const hookExit = hookRouteExitKind.setTo({});
const hookNext = hookRouteNextKind.setTo({});

export function exitHookFunction() {
	return hookExit;
}

export function nextHookFunction() {
	return hookNext;
}

export function buildHookBefore(
	hooks: (
		| HookBeforeRouteExecution
	)[],
) {
	if (!hooks.length) {
		return exitHookFunction;
	}
	return async(params: RouteHookParams) => {
		for (let index = 0; index < hooks.length; index++) {
			let result = hooks[index]!(params);

			if (result instanceof Promise) {
				result = await result;
			}

			if (
				hookRouteExitKind.has(result)
				|| result instanceof HookResponse
			) {
				return result;
			}
		}

		return hookNext;
	};
}

export function buildHookErrorBefore(
	hooks: HookError[],
) {
	if (!hooks.length) {
		return exitHookFunction;
	}
	return async(params: RouteHookErrorParams) => {
		for (let index = 0; index < hooks.length; index++) {
			let result = hooks[index]!(params);

			if (result instanceof Promise) {
				result = await result;
			}

			if (
				hookRouteExitKind.has(result)
				|| result instanceof HookResponse
			) {
				return result;
			}
		}

		return hookNext;
	};
}

export function buildHookAfter(
	hooks: (
		| HookBeforeSendResponse
		| HookSendResponse
		| HookAfterSendResponse
	)[],
) {
	if (!hooks.length) {
		return exitHookFunction;
	}
	return async(params: RouteHookParamsAfter) => {
		for (let index = 0; index < hooks.length; index++) {
			let result = hooks[index]!(params);

			if (result instanceof Promise) {
				result = await result;
			}

			if (hookRouteExitKind.has(result)) {
				return result;
			}
		}

		return hookNext;
	};
}

export function createHookResponse(from: keyof HookRouteLifeCycle): RouteHookParams["response"] {
	return (
		code,
		information,
		body,
	) => new HookResponse(from, code, information, body);
}
