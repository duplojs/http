interface MakeOpenApiPageParams {
	pageTitle: string;
	openApiDocument: string;
	swaggerUiVersion: string;
}

export function makeOpenApiPage(params: MakeOpenApiPageParams) {
	return /* html */`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="SwaggerUI"/>
		<title>${params.pageTitle}</title>
		<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${params.swaggerUiVersion}/swagger-ui.css" />
		<script src="https://unpkg.com/swagger-ui-dist@${params.swaggerUiVersion}/swagger-ui-bundle.js" crossorigin></script>
	</head>
	<body>
	<div id="swagger-ui"></div>
	<script>
		window.onload = () => {
			window.ui = SwaggerUIBundle({
				spec: ${params.openApiDocument},
				dom_id: "#swagger-ui",
			});
		};
	</script>
	</body>
	</html>
	`;
}
