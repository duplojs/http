import '../../response/index.mjs';
import '../../route/index.mjs';
import { hookRouteExitKind, hookRouteNextKind } from '../../route/hooks.mjs';
import { HookResponse } from '../../response/hook.mjs';

/* eslint-disable @typescript-eslint/prefer-for-of */
const hookExit = hookRouteExitKind.setTo({});
const hookNext = hookRouteNextKind.setTo({});
function exitHookFunction() {
    return hookExit;
}
function nextHookFunction() {
    return hookNext;
}
function buildHookBefore(hooks) {
    if (!hooks.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks.length; index++) {
            let result = hooks[index](params);
            if (result instanceof Promise) {
                result = await result;
            }
            if (hookRouteExitKind.has(result)
                || result instanceof HookResponse) {
                return result;
            }
        }
        return hookNext;
    };
}
function buildHookErrorBefore(hooks) {
    if (!hooks.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks.length; index++) {
            let result = hooks[index](params);
            if (result instanceof Promise) {
                result = await result;
            }
            if (hookRouteExitKind.has(result)
                || result instanceof HookResponse) {
                return result;
            }
        }
        return hookNext;
    };
}
function buildHookAfter(hooks) {
    if (!hooks.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks.length; index++) {
            let result = hooks[index](params);
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
function createHookResponse(from) {
    return (code, information, body) => new HookResponse(from, code, information, body);
}

export { buildHookAfter, buildHookBefore, buildHookErrorBefore, createHookResponse, exitHookFunction, nextHookFunction };
