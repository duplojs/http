'use strict';

var index = require('../../route/index.cjs');
var utils = require('@duplojs/utils');
require('../../response/index.cjs');
var hook = require('./hook.cjs');
var create = require('./create.cjs');
require('../steps/index.cjs');
var processStep = require('../steps/defaults/processStep.cjs');
var base = require('../../response/base.cjs');
var hook$1 = require('../../response/hook.cjs');

/* eslint-disable @typescript-eslint/prefer-for-of */
const defaultRouteFunctionBuilder = create.createRouteFunctionBuilder(index.routeKind.has, async (route, { success, buildStep, globalHooksRouteLifeCycle, }) => {
    const { hooks: routeHooks, preflightSteps, steps, } = route.definition;
    const maybeBuildedSteps = await processStep.buildStepsFunction(steps, buildStep);
    if (utils.E.isLeft(maybeBuildedSteps)) {
        return maybeBuildedSteps;
    }
    const buildedSteps = maybeBuildedSteps;
    const maybeBuildedPreFlightSteps = await processStep.buildStepsFunction(preflightSteps, buildStep);
    if (utils.E.isLeft(maybeBuildedPreFlightSteps)) {
        return maybeBuildedPreFlightSteps;
    }
    const buildedPreFlightSteps = maybeBuildedPreFlightSteps;
    const allHooks = [
        ...routeHooks,
        ...utils.A.flatMap(buildedPreFlightSteps, ({ hooksRouteLifeCycle }) => hooksRouteLifeCycle),
        ...utils.A.flatMap(buildedSteps, ({ hooksRouteLifeCycle }) => hooksRouteLifeCycle),
        ...globalHooksRouteLifeCycle,
    ];
    const hookAfterSendResponse = utils.pipe(allHooks, utils.A.map(({ afterSendResponse }) => afterSendResponse), utils.A.filter(utils.isType("function")), utils.forward);
    const hookBeforeRouteExecution = utils.pipe(allHooks, utils.A.map(({ beforeRouteExecution }) => beforeRouteExecution), utils.A.filter(utils.isType("function")), utils.forward);
    const hookBeforeSendResponse = utils.pipe(allHooks, utils.A.map(({ beforeSendResponse }) => beforeSendResponse), utils.A.filter(utils.isType("function")), utils.forward);
    const hookOnConstructRequest = utils.pipe(allHooks, utils.A.map(({ onConstructRequest }) => onConstructRequest), utils.A.filter(utils.isType("function")), utils.forward);
    const hookParseBody = utils.pipe(allHooks, utils.A.map(({ parseBody }) => parseBody), utils.A.filter(utils.isType("function")), utils.forward);
    const hookError = utils.pipe(allHooks, utils.A.map(({ error }) => error), utils.A.filter(utils.isType("function")), utils.forward);
    const hookSendResponse = utils.pipe(allHooks, utils.A.map(({ sendResponse }) => sendResponse), utils.A.filter(utils.isType("function")), utils.forward);
    const hooks = {
        afterSendResponse: hook.buildHookAfter(hookAfterSendResponse),
        beforeRouteExecution: hook.buildHookBefore(hookBeforeRouteExecution),
        beforeSendResponse: hook.buildHookAfter(hookBeforeSendResponse),
        onConstructRequest: hookOnConstructRequest.length
            ? async (params) => {
                let newRequest = params.request;
                for (let index = 0; index < hookOnConstructRequest.length; index++) {
                    newRequest = await hookOnConstructRequest[index]({
                        ...params,
                        request: newRequest,
                    });
                }
                return newRequest;
            }
            : (params) => params.request,
        parseBody: hook.buildHookBefore(hookParseBody),
        error: hook.buildHookErrorBefore(hookError),
        sendResponse: hook.buildHookAfter(hookSendResponse),
    };
    async function routeExecution(request) {
        try {
            const beforeRouteExecutionResult = await hooks.beforeRouteExecution({
                request,
                exit: hook.exitHookFunction,
                next: hook.nextHookFunction,
                response: hook.createHookResponse("beforeRouteExecution"),
            });
            if (beforeRouteExecutionResult instanceof base.Response) {
                return beforeRouteExecutionResult;
            }
            let floor = {};
            for (let index = 0; index < buildedPreFlightSteps.length; index++) {
                const result = await buildedPreFlightSteps[index].buildedFunction(request, floor);
                if (result instanceof base.Response) {
                    return result;
                }
                floor = result;
            }
            const parseBodyResult = await hooks.parseBody({
                request,
                exit: hook.exitHookFunction,
                next: hook.nextHookFunction,
                response: hook.createHookResponse("parseBody"),
            });
            if (parseBodyResult instanceof base.Response) {
                return parseBodyResult;
            }
            for (let index = 0; index < buildedSteps.length; index++) {
                const result = await buildedSteps[index].buildedFunction(request, floor);
                if (result instanceof base.Response) {
                    return result;
                }
                floor = result;
            }
            return new base.Response("500", "missing-response", undefined);
        }
        catch (error) {
            const errorResult = await hooks.error({
                request,
                error,
                exit: hook.exitHookFunction,
                next: hook.nextHookFunction,
                response: hook.createHookResponse("error"),
            });
            if (errorResult instanceof hook$1.HookResponse) {
                return errorResult;
            }
            return new base.Response("500", "server-error", error);
        }
    }
    return success(async (request) => {
        const currentRequest = await hooks.onConstructRequest({
            request,
            addRequestProperties: (newProperties) => {
                for (const key in newProperties) {
                    request[key] = newProperties[key];
                }
                return request;
            },
        });
        const currentResponse = await routeExecution(currentRequest);
        const afterHookParams = {
            request: currentRequest,
            currentResponse,
            exit: hook.exitHookFunction,
            next: hook.nextHookFunction,
        };
        await hooks.beforeSendResponse(afterHookParams);
        await hooks.sendResponse(afterHookParams);
        await hooks.afterSendResponse(afterHookParams);
    });
});

exports.defaultRouteFunctionBuilder = defaultRouteFunctionBuilder;
