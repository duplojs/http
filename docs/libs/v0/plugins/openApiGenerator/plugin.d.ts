import type { HubPlugin } from "../../core/hub";
import type { RoutePath } from "../../core/route";
import type { SupportedBearerFormat } from "./types";
interface OpenApiSecurityOptionBearer {
    type: "bearer";
    bearerFormat?: SupportedBearerFormat;
}
interface OpenApiSecurityOptionApiKey {
    type: "apiKey";
    paramName: string;
    in: "header" | "query" | "cookie";
}
interface OpenApiSecurityOptionBasic {
    type: "basic";
}
export interface OpenApiGeneratorPluginParams {
    routePath?: RoutePath;
    outputFile?: string;
    /**
     * @default "Swagger API"
     */
    title?: string;
    /**
     * @default "0.0.0"
     */
    version?: string;
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
    security?: OpenApiSecurityOptionBearer | OpenApiSecurityOptionApiKey | OpenApiSecurityOptionBasic;
    servers?: {
        url: string;
        description?: string;
    }[];
    /**
     * @default "5.31.0"
     */
    swaggerUiVersion?: string;
}
export declare function openApiGeneratorPlugin(pluginParams: OpenApiGeneratorPluginParams): () => HubPlugin;
export {};
