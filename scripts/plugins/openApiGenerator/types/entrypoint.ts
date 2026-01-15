import type { JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";

export interface EntrypointParameter {
	name: string;
	in: "path" | "query" | "header";
	required: boolean;
	schema: JsonSchema;
}

export interface EntrypointRequestBody {
	required: true;
	content: {
		"application/json": JsonSchema;
	};
}
