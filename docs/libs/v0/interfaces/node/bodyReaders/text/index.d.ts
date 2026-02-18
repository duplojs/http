import { type HttpServerParams } from "../../../../core/types";
export * from "./readRequestText";
export declare function createTextBodyReaderImplementation(serverParams: HttpServerParams): import("../../../../core/request").BodyReaderImplementation<"text", import("../../../../core/request").TextBodyReaderParams>;
