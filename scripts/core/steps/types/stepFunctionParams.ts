import { type Request } from "@core/request";
import { type Response } from "@core/response";
import { type IsEqual, type Or } from "@duplojs/utils";

export interface StepFunctionParams<
	GenericRequest extends Request = Request,
	GenericResponse extends Response = Response,
> {
	request: GenericRequest;
	response<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		...args: Or<[
			IsEqual<GenericFilteredResponse["body"], unknown>,
			IsEqual<GenericFilteredResponse["body"], undefined>,
		]> extends true
			? [body?: NoInfer<GenericFilteredResponse["body"]>]
			: [body: NoInfer<GenericFilteredResponse["body"]>]
	): GenericFilteredResponse;
}
