import { createCoreLibKind } from "@core/kind";
import { Response, type SuccessResponseCode } from "@core/response";
import { type Stream } from "@core/stream";
import { kindHeritage, type MaybePromise } from "@duplojs/utils";

const defaultParamsParent = [undefined, undefined, undefined] as const;
const defaultParams = {};

export class StreamPredictedResponse<
	GenericCode extends SuccessResponseCode = SuccessResponseCode,
	GenericInformation extends string = string,
	GenericFlux extends unknown = unknown,
> extends kindHeritage(
		"stream-predicted-response",
		createCoreLibKind("stream-predicted-response"),
		Response,
	) {
	public override code: GenericCode;

	public override information: GenericInformation;

	public override body = undefined;

	public constructor(
		code: GenericCode,
		information: GenericInformation,
		public startStream: (
			params: Stream.StartSendingParams<GenericFlux>
		) => MaybePromise<void>,
	) {
		super(defaultParams, defaultParamsParent);
		this.code = code;
		this.information = information;
	}
}
