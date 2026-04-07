import { insertParamsInPath } from "./insertParamsInPath";
import { type PromiseRequestParams, type ClientResponse, type CreateClientCacheKeyParams } from "./types";

export function autoCreateCacheKey(
	params: CreateClientCacheKeyParams,
) {
	try {
		return JSON.stringify({
			method: params.method,
			path: insertParamsInPath(params.path, params.params),
			query: params.query
				? Object.entries(params.query).sort(
					(entryA, entryB) => entryA[0].localeCompare(entryB[0]),
				)
				: undefined,
			body: params.body,
		});
	} catch {
		return null;
	}
}

export function findResponseFromCacheStore(
	requestParams: PromiseRequestParams,
): null | ClientResponse {
	if (
		!requestParams.clientCache
		|| requestParams.bypassClientCache === true
		|| requestParams.refreshClientCache === true
	) {
		return null;
	}

	const key = requestParams.clientCache({
		method: requestParams.method,
		path: requestParams.path,
		body: requestParams.body,
		headers: requestParams.headers,
		hookParams: requestParams.hookParams,
		params: requestParams.params,
		query: requestParams.query,
	});

	if (key === null) {
		return null;
	}

	const cachedResponse = requestParams.cacheStore.get(key);

	if (!cachedResponse) {
		return null;
	}

	const rawResponse = new Response(undefined, { headers: cachedResponse.headers });
	return {
		...cachedResponse,
		information: cachedResponse.information,
		headers: rawResponse.headers,
		raw: rawResponse,
		requestParams,
		fromCache: true,
	};
}

export function saveResponseInCacheStore(
	requestParams: PromiseRequestParams,
	clientResponse: ClientResponse,
) {
	if (
		!requestParams.clientCache
		|| requestParams.bypassClientCache === true
	) {
		return;
	}

	const key = requestParams.clientCache({
		method: requestParams.method,
		path: requestParams.path,
		body: requestParams.body,
		headers: requestParams.headers,
		hookParams: requestParams.hookParams,
		params: requestParams.params,
		query: requestParams.query,
	});

	if (key === null) {
		return;
	}

	requestParams.cacheStore.set(
		key,
		{
			body: clientResponse.body,
			code: clientResponse.code,
			headers: Object.fromEntries(clientResponse.headers.entries()),
			information: clientResponse.information,
			ok: clientResponse.ok,
			predicted: clientResponse.predicted,
			redirected: clientResponse.redirected,
			type: clientResponse.type,
			url: clientResponse.url,
		},
	);
}
