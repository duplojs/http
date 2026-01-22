interface MakeOpenApiPageParams {
    pageTitle: string;
    openApiDocument: string;
    swaggerUiVersion: string;
}
export declare function makeOpenApiPage(params: MakeOpenApiPageParams): string;
export {};
