export function getBody(response: Response): Promise<unknown> {
	const responseContentType = response.headers.get("content-type") ?? undefined;
	if (!responseContentType) {
		return Promise.resolve(undefined);
	} else if (responseContentType.includes("json")) {
		return response.json();
	} else if (responseContentType.includes("text")) {
		return response.text();
	} else if (responseContentType.includes("form-data")) {
		return response.formData();
	} else {
		return response.blob();
	}
}
