'use strict';

async function launchRequestHook(clientHook, promiseRequestHook, requestParams) {
    let resultRequestParams = requestParams;
    for (let index = 0; index < promiseRequestHook.length; index++) {
        resultRequestParams = await promiseRequestHook[index](resultRequestParams);
    }
    for (let index = 0; index < clientHook.length; index++) {
        resultRequestParams = await clientHook[index](resultRequestParams);
    }
    return resultRequestParams;
}
async function launchResponseHook(clientHook, promiseRequestHook, response) {
    let resultResponse = response;
    for (let index = 0; index < promiseRequestHook.length; index++) {
        resultResponse = await promiseRequestHook[index](resultResponse);
    }
    for (let index = 0; index < clientHook.length; index++) {
        resultResponse = await clientHook[index](resultResponse);
    }
    return resultResponse;
}
async function launchInformationHook(clientHook, promiseRequestHook, response) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](response);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](response);
    }
}
async function launchCodeHook(clientHook, promiseRequestHook, response) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](response);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](response);
    }
}
async function launchResponseTypeHook(clientHook, promiseRequestHook, response) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](response);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](response);
    }
}
async function launchExpectedResponseHook(clientHook, promiseRequestHook, response) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](response);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](response);
    }
}
async function launchNotPredictedHook(clientHook, promiseRequestHook, response) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](response);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](response);
    }
}
async function launchErrorHook(clientHook, promiseRequestHook, error, requestParams) {
    for (let index = 0; index < promiseRequestHook.length; index++) {
        await promiseRequestHook[index](error, requestParams);
    }
    for (let index = 0; index < clientHook.length; index++) {
        await clientHook[index](error, requestParams);
    }
}

exports.launchCodeHook = launchCodeHook;
exports.launchErrorHook = launchErrorHook;
exports.launchExpectedResponseHook = launchExpectedResponseHook;
exports.launchInformationHook = launchInformationHook;
exports.launchNotPredictedHook = launchNotPredictedHook;
exports.launchRequestHook = launchRequestHook;
exports.launchResponseHook = launchResponseHook;
exports.launchResponseTypeHook = launchResponseTypeHook;
