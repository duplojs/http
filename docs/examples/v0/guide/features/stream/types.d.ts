export type Routes = {
	method: "GET";
	path: "/binary-stream";
	responses: {
		code: "200";
		information: "binary-stream";
		body?: undefined;
		flux: Uint8Array<ArrayBuffer>;
	};
} | {
	method: "POST";
	path: "/text-stream";
	body: {
		value: string;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "text-stream";
		body?: undefined;
		flux: string;
	};
};
