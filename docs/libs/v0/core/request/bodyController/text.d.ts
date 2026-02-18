import { type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams } from "./base";
export interface TextBodyReaderParams extends BodyControllerParams {
}
export declare const TextBodyController: import("./base").BodyControllerHandler<"text", TextBodyReaderParams>;
export type TextBodyController = typeof TextBodyController;
export interface ControlBodyAsTextParams {
    bodyMaxSize?: number | BytesInString;
}
export declare function controlBodyAsText(params?: ControlBodyAsTextParams): import("./base").BodyController<"text", TextBodyReaderParams>;
