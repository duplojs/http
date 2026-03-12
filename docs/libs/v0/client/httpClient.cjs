'use strict';

var OO = require('@duplojs/utils/object');
var GG = require('@duplojs/utils/generator');
var kind = require('./kind.cjs');
var promiseRequest = require('./promiseRequest.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var OO__namespace = /*#__PURE__*/_interopNamespaceDefault(OO);
var GG__namespace = /*#__PURE__*/_interopNamespaceDefault(GG);

const httpClientKind = kind.createClientKind("http-client");
function createHttpClient(clientParams) {
    const hooks = OO__namespace.override({
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
        beforeRetryServerEvent: [],
        closeServerEvent: [],
        errorServerEvent: [],
        receiveEventServerEvent: [],
        startServerEvent: [],
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
            for (const [header, headerValue] of OO__namespace.entries(headers)) {
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
        addBeforeRetryServerEventHook(hook) {
            hooks.beforeRetryServerEvent.push(hook);
        },
        addCloseServerEventHook(hook) {
            hooks.closeServerEvent.push(hook);
        },
        addErrorServerEventHook(hook) {
            hooks.errorServerEvent.push(hook);
        },
        addReceiveEventServerEventHook(hook) {
            hooks.receiveEventServerEvent.push(hook);
        },
        addStartServerEventHook(hook) {
            hooks.startServerEvent.push(hook);
        },
        request(params) {
            const headers = GG__namespace.reduce(defaultHeaders.entries(), GG__namespace.reduceFrom({}), ({ element, lastValue, next }) => {
                const value = element[1]();
                if (value !== undefined) {
                    lastValue[element[0]] = `${value}`;
                }
                return next(lastValue);
            });
            return new promiseRequest.PromiseRequest({
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
                abortController: params.abortController ?? new AbortController(),
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

exports.createHttpClient = createHttpClient;
exports.httpClientKind = httpClientKind;
