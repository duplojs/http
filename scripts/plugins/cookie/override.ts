import { Request } from "@core/request";
import { Response } from "@core/response";
import type { SerializerParams } from "./serialize";

declare module "@core/request" {
	interface Request {
		cookies?: Partial<Record<string, string>>;
	}
}

declare module "@core/response" {
	interface Response<GenericCode, GenericInformation, GenericBody> {
		cookie?: Record<string, {
			value: string;
			params?: SerializerParams;
		}>;
		setCookie(name: string, value: string, params?: SerializerParams): this;
		dropCookie(name: string): this;
	}
}

Request.prototype.cookies = undefined;

Response.prototype.cookie = undefined;

Response.prototype.setCookie = function(name, value, params) {
	if (!this.cookie) {
		this.cookie = {};
	}

	this.cookie![name] = {
		value,
		params,
	};

	return this;
};

Response.prototype.dropCookie = function(name) {
	if (!this.cookie) {
		this.cookie = {};
	}

	this.cookie![name] = {
		value: "",
		params: {
			maxAge: 0,
		},
	};

	return this;
};
