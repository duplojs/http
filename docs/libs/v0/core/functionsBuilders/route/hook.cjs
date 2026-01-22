'use strict';

require('../../route/index.cjs');
var hooks = require('../../route/hooks.cjs');
var hook = require('../../response/hook.cjs');

/* eslint-disable @typescript-eslint/prefer-for-of */
const hookExit = hooks.hookRouteExitKind.setTo({});
const hookNext = hooks.hookRouteNextKind.setTo({});
function exitHookFunction() {
    return hookExit;
}
function nextHookFunction() {
    return hookNext;
}
function buildHookBefore(hooks$1) {
    if (!hooks$1.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks$1.length; index++) {
            const result = await hooks$1[index](params);
            if (hooks.hookRouteExitKind.has(result)
                || result instanceof hook.HookResponse) {
                return result;
            }
        }
        return hookNext;
    };
}
function buildHookErrorBefore(hooks$1) {
    if (!hooks$1.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks$1.length; index++) {
            const result = await hooks$1[index](params);
            if (hooks.hookRouteExitKind.has(result)
                || result instanceof hook.HookResponse) {
                return result;
            }
        }
        return hookNext;
    };
}
function buildHookAfter(hooks$1) {
    if (!hooks$1.length) {
        return exitHookFunction;
    }
    return async (params) => {
        for (let index = 0; index < hooks$1.length; index++) {
            const result = await hooks$1[index](params);
            if (hooks.hookRouteExitKind.has(result)) {
                return result;
            }
        }
        return hookNext;
    };
}
function createHookResponse(from) {
    return (code, information, body) => new hook.HookResponse(from, code, information, body);
}

exports.buildHookAfter = buildHookAfter;
exports.buildHookBefore = buildHookBefore;
exports.buildHookErrorBefore = buildHookErrorBefore;
exports.createHookResponse = createHookResponse;
exports.exitHookFunction = exitHookFunction;
exports.nextHookFunction = nextHookFunction;
