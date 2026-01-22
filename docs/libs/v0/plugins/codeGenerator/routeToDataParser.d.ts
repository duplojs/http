import { type Route } from "../../core/route";
import { DP } from "@duplojs/utils";
import { type ResponseContract } from "../../core/response";
export interface RouteToDataParserParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function routeToDataParser(route: Route, params: RouteToDataParserParams): DP.DataParser[];
