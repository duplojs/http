import { type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams } from "./base";
export interface FormDataBodyReaderParams extends BodyControllerParams {
    maxFileQuantity: number;
    mimeType?: RegExp;
    fileMaxSize?: number;
    maxBufferSize: number;
    maxIndexArray: number;
    maxKeyLength: number;
}
export declare const FormDataBodyController: import("./base").BodyControllerHandler<"formData", FormDataBodyReaderParams>;
export type FormDataBodyController = typeof FormDataBodyController;
export interface ControlBodyAsFormDataParams {
    maxFileQuantity: number;
    mimeType?: string | string[] | RegExp;
    bodyMaxSize?: number | BytesInString;
    fileMaxSize?: number | BytesInString;
    maxBufferSize?: number | BytesInString;
    maxIndexArray?: number;
    maxKeyLength?: number;
}
export declare function controlBodyAsFormData(params: ControlBodyAsFormDataParams): import("./base").BodyController<"formData", FormDataBodyReaderParams>;
