import type { RoutePath } from "@core/route";
import type { OpenApiMethod } from "./openApiMethod";
import type { OpenApiOperation } from "./openApiOperation";

export type OpenApiPath = Record<
	RoutePath,
	Partial<Record<OpenApiMethod, OpenApiOperation>> | undefined
>;
