import { type Hub } from "../../core/hub";
import http from "http";
import https from "https";
import { O } from "@duplojs/utils";
import { type HttpServerParams } from "../../core/types";
declare module "../../core/types" {
    interface HttpServerParams {
        readonly interface: "node";
        readonly http?: http.ServerOptions;
        readonly https?: https.ServerOptions;
    }
    interface HostCustom {
        "::": true;
        "0.0.0.0": true;
        localhost: true;
        "127.0.0.1": true;
        "::1": true;
    }
}
export type CreateHttpServerParams = O.PartialKeys<Omit<HttpServerParams, "interface">, "maxBodySize" | "informationHeaderKey" | "predictedHeaderKey" | "fromHookHeaderKey" | "uploadFolder">;
export declare function createHttpServer(hub: Hub, params: CreateHttpServerParams): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
