import type { JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";
import type { OpenApiSecuritySchema } from "./openApiSecuritySchema";
import type { OpenApiPath } from "./openApiPath";

export interface OpenApiDocument {
	openapi: "3.1.0";
	info: {
		title: string;
		version: string;
		summary?: string;
		contact?: {
			name?: string;
			email?: string;
			url?: string;
		};
		license?: {
			name: string;
			url?: string;
			identifier?: string;
		};
	};
	servers?: {
		url: string;
		description?: string;
	}[];
	paths: OpenApiPath;
	components: {
		schemas: Record<string, JsonSchema>;
		securitySchemes?: Record<string, OpenApiSecuritySchema>;
	};
	security?: Record<string, string[]>[];
}
