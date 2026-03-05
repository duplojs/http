
import { createCoreLibKind } from "@core/kind";
import { Response, type SuccessResponseCode } from "@core/response";
import { type ServerSentEvents } from "@core/serverSentEvents";
import { kindHeritage, type MillisecondInString, type MaybePromise } from "@duplojs/utils";

const defaultParamsParent = [undefined, undefined, undefined] as const;
const defaultParams = {};

export interface ServerSentEventsPredictedResponseParams {
	intervalPing?: number | MillisecondInString;
}

export class ServerSentEventsPredictedResponse<
	GenericCode extends SuccessResponseCode = SuccessResponseCode,
	GenericInformation extends string = string,
	GenericEvents extends ServerSentEvents.DefinitionShape = ServerSentEvents.DefinitionShape,
> extends kindHeritage(
		"server-sent-events-predicted-response",
		createCoreLibKind("server-sent-events-predicted-response"),
		Response,
	) {
	public override code: GenericCode;

	public override information: GenericInformation;

	public override body = undefined;

	public constructor(
		code: GenericCode,
		information: GenericInformation,
		public startSendingEvents: (
			params: ServerSentEvents.StartSendingParams<GenericEvents>
		) => MaybePromise<void>,
		public params?: ServerSentEventsPredictedResponseParams,
	) {
		super(defaultParams, defaultParamsParent);
		this.code = code;
		this.information = information;
	}
}
