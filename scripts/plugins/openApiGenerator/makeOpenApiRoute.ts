import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { DP } from "@duplojs/utils";

export function makeOpenApiRoute(
	routePath: RoutePath,
	openApiPage: string,
) {
	return useRouteBuilder(
		"GET",
		routePath,
		{ metadata: [IgnoreByRouteStoreMetadata()] },
	)
		.handler(
			ResponseContract.ok("swaggerUi", DP.string()),
			(__, { response }) => response("swaggerUi", openApiPage)
				.setHeader("content-type", "text/html"),
		);
}
