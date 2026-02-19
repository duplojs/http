import type { TheFormData } from "@duplojs/utils";

export type Routes = {
	method: "GET";
	path: "/users";
	responses: {
		code: "200";
		information: "users.findMany";
		body: {
			id: number;
			name: string;
			age: number;
		}[];
	};
} | {
	method: "GET";
	path: "/users/{userId}";
	params: {
		userId: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "users.find";
		body: {
			id: number;
			name: string;
			age: number;
		};
	};
} | {
	method: "POST";
	path: "/users";
	body: {
		id: number;
		name: string;
		age: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "users.create";
		body: {
			id: number;
			name: string;
			age: number;
		};
	};
} | {
	method: "POST";
	path: "/documents";
	body: TheFormData<{
		bool: boolean;
		myFile: [
			File,
		];
	}>;
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "204";
		information: "file.receive";
		body?: undefined;
	};
} | {
	method: "GET";
	path: `/documents/${string}`;
	responses: {
		code: "200";
		information: "file.send";
		body: File;
	};
};
