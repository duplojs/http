import type { ResponseCode } from "../../../core/response";
import type { EntrypointParameter, EntrypointRequestBody } from "./entrypoint";
import type { EndpointResponse } from "./endpointResponse";
export interface OpenApiOperation {
    parameters?: EntrypointParameter[];
    requestBody?: EntrypointRequestBody;
    responses: Partial<Record<ResponseCode, EndpointResponse>>;
}
