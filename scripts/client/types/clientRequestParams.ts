import { type MaybeArray } from "@duplojs/utils";
import { type Hooks } from "../hooks";

export interface ClientRequestInitParams extends Pick<
	RequestInit,
	| "cache"
	| "credentials"
	| "integrity"
	| "keepalive"
	| "mode"
	| "redirect"
	| "referrer"
	| "referrerPolicy"
	| "signal"
> {

}

export interface ClientRequestParams<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
	method: string;
	path: string;
	baseUrl: string;
	headers: Record<string, MaybeArray<string> | undefined | null>;
	query: Record<string, MaybeArray<string> | undefined | null>;
	params: Record<string, string>;
	body: unknown;
	hooks: Hooks;
	initParams: ClientRequestInitParams;
	hookParams: GenericHookParams;
}
