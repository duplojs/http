import { type HttpServerParams, type Hub } from "../../core/hub";
import { type Hosts } from "./types/host";
import { type O, type BytesInString } from "@duplojs/utils";
import http from "http";
import https from "https";
declare module "../../core/hub" {
    interface HttpServerParams {
        readonly interface: "node";
        readonly host: Hosts;
        readonly port: number;
        readonly maxBodySize: BytesInString | number;
        readonly informationHeaderKey: string;
        readonly predictedHeaderKey: string;
        readonly fromHookHeaderKey: string;
        readonly http?: http.ServerOptions;
        readonly https?: https.ServerOptions;
    }
    interface HttpServerErrorParams {
        readonly serverRequest: http.IncomingMessage;
        readonly serverResponse: http.ServerResponse;
    }
}
export type CreateHttpServerParams = O.PartialKeys<Omit<HttpServerParams, "interface">, "maxBodySize" | "informationHeaderKey" | "predictedHeaderKey" | "fromHookHeaderKey">;
export declare function createHttpServer(inputHub: Hub, params: CreateHttpServerParams): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
