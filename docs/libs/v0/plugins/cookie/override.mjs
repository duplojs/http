import { Request } from '../../core/request/index.mjs';
import '../../core/response/index.mjs';
import { Response } from '../../core/response/base.mjs';

Request.prototype.cookies = undefined;
Response.prototype.cookie = undefined;
Response.prototype.setCookie = function (name, value, params) {
    if (!this.cookie) {
        this.cookie = Object.create(null);
    }
    this.cookie[name] = {
        value,
        params,
    };
    return this;
};
Response.prototype.dropCookie = function (name) {
    if (!this.cookie) {
        this.cookie = Object.create(null);
    }
    this.cookie[name] = {
        value: "",
        params: {
            maxAge: 0,
        },
    };
    return this;
};
