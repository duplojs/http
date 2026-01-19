import type { JsonSchema, JsonSchemaLiteral, JsonSchemaString } from "@duplojs/data-parser-tools/toJsonSchema";

export interface EndpointResponseHeader {
	information: {
		schema: JsonSchemaLiteral;
		description: string;
	};
}

export interface EndpointResponseContent {
	"application/json"?: {
		schema: JsonSchema;
	};
	"plain/text"?: {
		schema: JsonSchemaString;
	};
}

export interface EndpointResponse {
	headers: EndpointResponseHeader;
	content?: EndpointResponseContent;
}
