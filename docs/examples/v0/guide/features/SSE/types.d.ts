export type Routes = {
	method: "GET";
	path: "/some-route";
	headers: {
		superToken: string;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "401";
		information: "invalid-token";
		body?: undefined;
	} | {
		code: "200";
		information: "SSE";
		body?: undefined;
		events: {
			otherEvent: string;
			message: {
				value: string;
			};
		};
	};
}