export type SupportedBearerFormat = "JWT" | "JWS" | "JWE" | "Opaque";

export interface OpenApiSecuritySchema {
	type: "http" | "apiKey";
	scheme?: "bearer" | "basic";
	bearerFormat?: SupportedBearerFormat;
	name?: string;
	in?: "header" | "query" | "cookie";
}
