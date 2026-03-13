import type { JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";

export interface EndpointResponseHeader {
	information: {
		schema: JsonSchema;
		description: string;
	};
}

export interface EndpointResponseContent {
	"text/event-stream"?: {
		itemSchema: JsonSchema;
	};
	"application/json"?: {
		schema: JsonSchema;
	};
	"plain/text"?: {
		schema: JsonSchema;
	};
}

export interface EndpointResponse {
	description?: string;
	headers: EndpointResponseHeader;
	content?: EndpointResponseContent;
}
