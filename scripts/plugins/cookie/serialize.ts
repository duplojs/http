import { D, kindHeritage } from "@duplojs/utils";
import { createCookiePluginKind } from "./kind";

const nameRegex = /^[!#$%&'*+\-.^_`|~A-Za-z0-9]+$/;
const domainValueRegex = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const pathValueRegex = /^[\u0020-\u003A\u003C-\u007E]*$/;

export class SerializeCookieError extends kindHeritage(
	"serialize-cookie-error",
	createCookiePluginKind("serialize-cookie-error"),
	Error,
) {
	public constructor(
		message: string,
	) {
		super({}, [message]);
	}
}

interface SerializerParamsBase {
	maxAge?: number;
	domain?: string;
	path?: string;
	httpOnly?: boolean;
	secure?: boolean;
	partitioned?: boolean;
	priority?: "low" | "medium" | "high";
	sameSite?: "lax" | "strict" | "none";
}

export interface SerializerParamsWithExpires extends SerializerParamsBase {
	expires?: D.TheDate;
	expireIn?: undefined;
}

export interface SerializerParamsWithExpireIn extends SerializerParamsBase {
	expires?: undefined;
	expireIn?: D.TheTime;
}

export type SerializerParams = SerializerParamsWithExpires | SerializerParamsWithExpireIn;

export function defaultSerializer(
	name: string,
	value: string,
	params?: SerializerParams,
): string {
	if (!nameRegex.test(name)) {
		throw new SerializeCookieError(`argument name is invalid: ${name}`);
	}

	let encodedValue = "";

	try {
		encodedValue = encodeURIComponent(value);
	} catch {
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
		setCookie += `; Expires=${params.expires.toUTCString()}`;
	}

	if (params?.expireIn !== undefined) {
		setCookie += `; Expires=${D.addTime(D.now(), params.expireIn).toUTCString()}`;
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
	} else if (params?.priority === "low") {
		setCookie += "; Priority=Low";
	} else if (params?.priority === "medium") {
		setCookie += "; Priority=Medium";
	}

	if (params?.sameSite === "strict") {
		setCookie += "; SameSite=Strict";
	} else if (params?.sameSite === "lax") {
		setCookie += "; SameSite=Lax";
	} else if (params?.sameSite === "none") {
		setCookie += "; SameSite=None";
	}

	return setCookie;
}

export type Serializer = typeof defaultSerializer;
