import * as OO from '@duplojs/utils/object';
import * as GG from '@duplojs/utils/generator';
import { createClientKind } from './kind.mjs';
import { PromiseRequest } from './promiseRequest.mjs';

const httpClientKind = createClientKind("http-client");
function createHttpClient(clientParams) {
    const hooks = OO.override({
        request: [],
        response: [],
        information: {},
        code: {},
        informationalResponseType: [],
        successfulResponseType: [],
        redirectionResponseType: [],
        clientErrorResponseType: [],
        serverErrorResponseType: [],
        expectedResponse: [],
        error: [],
        notPredictedResponse: [],
    }, clientParams.hooks ?? {});
    const config = {
        baseUrl: clientParams.baseUrl,
        disabledPredictedMode: clientParams.disabledPredictedMode ?? false,
        informationHeaderKey: clientParams.informationHeaderKey ?? "information",
        predictedHeaderKey: clientParams.predictedHeaderKey ?? "predicted",
        cache: clientParams.cache,
        credentials: clientParams.credentials,
    };
    const defaultHeaders = new Map();
    const self = httpClientKind.setTo({
        config,
        hooks,
        defaultHeaders,
        addDefaultHeader(headerName, headerValue) {
            defaultHeaders.set(headerName, typeof headerValue === "function"
                ? headerValue
                : () => headerValue);
        },
        addDefaultHeaders(headers) {
            for (const [header, headerValue] of OO.entries(headers)) {
                self.addDefaultHeader(header, headerValue);
            }
        },
        addRequestHook(hook) {
            hooks.request.push(hook);
        },
        addResponseHook(hook) {
            hooks.response.push(hook);
        },
        addInformationHook(information, hook) {
            hooks.information[information] ??= [];
            hooks.information[information].push(hook);
        },
        addCodeHook(code, hook) {
            hooks.code[code] ??= [];
            hooks.code[code].push(hook);
        },
        addInformationalResponseTypeHook(hook) {
            hooks.informationalResponseType.push(hook);
        },
        addSuccessfulResponseTypeHook(hook) {
            hooks.successfulResponseType.push(hook);
        },
        addRedirectionResponseTypeHook(hook) {
            hooks.redirectionResponseType.push(hook);
        },
        addClientErrorResponseTypeHook(hook) {
            hooks.clientErrorResponseType.push(hook);
        },
        addServerErrorResponseTypeHook(hook) {
            hooks.serverErrorResponseType.push(hook);
        },
        addExpectedResponseHook(hook) {
            hooks.expectedResponse.push(hook);
        },
        addNotPredictedResponseHook(hook) {
            hooks.notPredictedResponse.push(hook);
        },
        addErrorHook(hook) {
            hooks.error.push(hook);
        },
        request(params) {
            const headers = GG.reduce(defaultHeaders.entries(), GG.reduceFrom({}), ({ element, lastValue, next }) => {
                lastValue[element[0]] = `${element[1]()}`;
                return next(lastValue);
            });
            return new PromiseRequest({
                hooks,
                baseUrl: config.baseUrl,
                ...params,
                headers: {
                    ...params.headers,
                    ...headers,
                },
                initParams: {
                    ...params.initParams,
                    credentials: params.initParams?.credentials ?? clientParams.credentials,
                    cache: params.initParams?.cache ?? clientParams.cache,
                },
                predictedHeaderKey: config.predictedHeaderKey,
                informationHeaderKey: config.informationHeaderKey,
                disabledPredicateMode: config.disabledPredictedMode,
            });
        },
        get: ((path, params) => self.request({
            method: "GET",
            path,
            ...params,
        })),
        post: ((path, params) => self.request({
            method: "POST",
            path,
            ...params,
        })),
        put: ((path, params) => self.request({
            method: "PUT",
            path,
            ...params,
        })),
        patch: ((path, params) => self.request({
            method: "PATCH",
            path,
            ...params,
        })),
        delete: ((path, params) => self.request({
            method: "DELETE",
            path,
            ...params,
        })),
    });
    return self;
}

export { createHttpClient, httpClientKind };
