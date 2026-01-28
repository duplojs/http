import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { DP } from "@duplojs/utils";
import { IgnoreByCodeGeneratorMetadata } from "@plugin-codeGenerator/metadata";
import { IgnoreByOpenApiGeneratorMetadata } from "./metadata";

export function makeOpenApiRoute(
	routePath: RoutePath,
	openApiPage: string,
) {
	return useRouteBuilder(
		"GET",
		routePath,
		{
			metadata: [
				IgnoreByRouteStoreMetadata(),
				IgnoreByOpenApiGeneratorMetadata(),
				IgnoreByCodeGeneratorMetadata(),
			],
		},
	)
		.handler(
			ResponseContract.ok("swaggerUi", DP.string()),
			(__, { response }) => response("swaggerUi", openApiPage)
				.setHeader("content-type", "text/html"),
		);
}
