import { type Request } from "../../request";
import { type PredictedResponse } from "../../response";
import { type IsEqual, type Or } from "@duplojs/utils";
export interface StepFunctionParams<GenericResponse extends PredictedResponse = PredictedResponse> {
    request: Request;
    response<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, ...args: Or<[
        IsEqual<GenericFilteredResponse["body"], unknown>,
        IsEqual<GenericFilteredResponse["body"], undefined>
    ]> extends true ? [body?: NoInfer<GenericFilteredResponse["body"]>] : [body: NoInfer<GenericFilteredResponse["body"]>]): GenericFilteredResponse;
}
