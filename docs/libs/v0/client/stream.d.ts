import { type ClientResponse, type ClientStreamResponse, type AllClientResponse } from "./types";
export declare function makeClientStreamResponse(response: ClientResponse): ClientStreamResponse;
export declare function isClientStreamResponse<GenericResponse extends AllClientResponse>(response: GenericResponse): response is Extract<GenericResponse, ClientStreamResponse>;
