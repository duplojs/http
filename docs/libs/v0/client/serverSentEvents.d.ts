import { type ClientEventsResponse, type ClientResponse, type AllClientResponse } from "./types";
export declare function makeClientEventsResponse(response: ClientResponse, fetchUrl: string, fetchInitParams: RequestInit): ClientEventsResponse;
export declare function isClientEventsResponse<GenericResponse extends AllClientResponse>(response: GenericResponse): response is Extract<GenericResponse, ClientEventsResponse>;
