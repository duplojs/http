import type { JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";

export interface EntrypointParameter {
	name: string;
	in: "path" | "query" | "header";
	required: boolean;
	schema: JsonSchema;
}

export interface EntrypointContentBodyApplicationJson {
	"application/json": {
		schema: JsonSchema;
	};
}

export interface EntrypointContentBodyTextPlain {
	"text/plain": {
		schema: JsonSchema;
	};
}

export type EntrypointContentBody = EntrypointContentBodyApplicationJson | EntrypointContentBodyTextPlain;

export interface EntrypointRequestBody {
	required: true;
	content: EntrypointContentBody;
}
