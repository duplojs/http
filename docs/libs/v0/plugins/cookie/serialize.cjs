'use strict';

var utils = require('@duplojs/utils');
var kind = require('./kind.cjs');

const nameRegex = /^[!#$%&'*+\-.^_`|~A-Za-z0-9]+$/;
const domainValueRegex = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const pathValueRegex = /^[\u0020-\u003A\u003C-\u007E]*$/;
class SerializeCookieError extends utils.kindHeritage("serialize-cookie-error", kind.createCookiePluginKind("serialize-cookie-error"), Error) {
    constructor(message) {
        super({}, [message]);
    }
}
function defaultSerializer(name, value, params) {
    if (!nameRegex.test(name)) {
        throw new SerializeCookieError(`argument name is invalid: ${name}`);
    }
    let encodedValue = "";
    try {
        encodedValue = encodeURIComponent(value);
    }
    catch {
        throw new SerializeCookieError(`argument value is invalid: ${value}`);
    }
    let setCookie = `${name}=${encodedValue}`;
    if (params?.maxAge !== undefined) {
        if (!Number.isInteger(params.maxAge)) {
            throw new SerializeCookieError(`param maxAge is invalid: ${params.maxAge}`);
        }
        setCookie += `; Max-Age=${params.maxAge}`;
    }
    if (params?.domain) {
        if (!domainValueRegex.test(params.domain)) {
            throw new SerializeCookieError(`param domain is invalid: ${params.domain}`);
        }
        setCookie += `; Domain=${params.domain}`;
    }
    if (params?.path) {
        if (!pathValueRegex.test(params.path)) {
            throw new SerializeCookieError(`param path is invalid: ${params.path}`);
        }
        setCookie += `; Path=${params.path}`;
    }
    if (params?.expires && params?.expireIn) {
        throw new SerializeCookieError("params expires and expireIn are mutually exclusive");
    }
    if (params?.expires) {
        if (!Number.isFinite(params.expires.getTime())) {
            throw new SerializeCookieError("param expires is invalid");
        }
        setCookie += `; Expires=${params.expires.toUTCString()}`;
    }
    if (params?.expireIn !== undefined) {
        if (!utils.D.isTime(params.expireIn)) {
            throw new SerializeCookieError("param expireIn is invalid");
        }
        setCookie += `; Expires=${utils.D.addTime(utils.D.now(), params.expireIn).toUTCString()}`;
    }
    if (params?.httpOnly) {
        setCookie += "; HttpOnly";
    }
    if (params?.secure) {
        setCookie += "; Secure";
    }
    if (params?.partitioned) {
        setCookie += "; Partitioned";
    }
    if (params?.priority === "high") {
        setCookie += "; Priority=High";
    }
    else if (params?.priority === "low") {
        setCookie += "; Priority=Low";
    }
    else if (params?.priority === "medium") {
        setCookie += "; Priority=Medium";
    }
    if (params?.sameSite === "strict") {
        setCookie += "; SameSite=Strict";
    }
    else if (params?.sameSite === "lax") {
        setCookie += "; SameSite=Lax";
    }
    else if (params?.sameSite === "none") {
        setCookie += "; SameSite=None";
    }
    return setCookie;
}

exports.SerializeCookieError = SerializeCookieError;
exports.defaultSerializer = defaultSerializer;
