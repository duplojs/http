'use strict';

var index = require('../../core/request/index.cjs');
require('../../core/response/index.cjs');
var base = require('../../core/response/base.cjs');

index.Request.prototype.cookies = undefined;
base.Response.prototype.cookie = undefined;
base.Response.prototype.setCookie = function (name, value, params) {
    if (!this.cookie) {
        this.cookie = {};
    }
    this.cookie[name] = {
        value,
        params,
    };
    return this;
};
base.Response.prototype.dropCookie = function (name) {
    if (!this.cookie) {
        this.cookie = {};
    }
    this.cookie[name] = {
        value: "",
        params: {
            maxAge: 0,
        },
    };
    return this;
};
