import { DP, type Kind, pipe, type IsEqual, type NeverCoalescing, kindHeritage } from "@duplojs/utils";
import { createCoreLibKind } from "../kind";
import { type ResponseCode, type PredictedResponse, type ServerSentEventsPredictedResponse, type SuccessResponseCode } from ".";
import { type ForbiddenBigintDataParser } from "@core/types";

const ErrorClass = Error;

export namespace ResponseContract {
	type SupportedDataParser = DP.DataParser;

	export const contractKind = createCoreLibKind("response-contract");
	export interface Contract<
		GenericCode extends ResponseCode = ResponseCode,
		GenericInformation extends string = string,
		GenericSchema extends SupportedDataParser = SupportedDataParser,
	> extends Kind<typeof contractKind.definition> {
		code: GenericCode;
		information: GenericInformation;
		body: GenericSchema;
	}

	function createContractBuilder<
		GenericCode extends ResponseCode,
		GenericOptionsNoSchema extends boolean = never,
		GenericOptionsDefaultSchema extends SupportedDataParser = never,
	>(
		code: GenericCode,
		options?: {
			noSchema?: GenericOptionsNoSchema;
			defaultSchema?: GenericOptionsDefaultSchema;
		},
	) {
		return <
			GenericInformation extends string,
			GenericSchema extends SupportedDataParser = GenericOptionsDefaultSchema,
		>(
			information: GenericInformation,
			...[schema]: IsEqual<GenericOptionsNoSchema, true> extends true
				? []
				: IsEqual<GenericOptionsDefaultSchema, never> extends true
					? [schema: GenericSchema & ForbiddenBigintDataParser<GenericSchema>]
					: [schema?: GenericSchema & ForbiddenBigintDataParser<GenericSchema>]
		): NoInfer<
			Contract<
				GenericCode,
				GenericInformation,
				NeverCoalescing<GenericSchema, DP.DataParserEmpty>
			>
		> => pipe(
			{
				code,
				information,
				body: (schema ?? options?.defaultSchema ?? DP.empty()) as never,
			},
			contractKind.setTo,
		);
	}

	const defaultSchema = DP.empty();

	export const http100Continue = createContractBuilder("100", { defaultSchema });
	export const switchingProtocols = createContractBuilder("101", { defaultSchema });
	export const processing = createContractBuilder("102", { defaultSchema });
	export const earlyHints = createContractBuilder("103", { defaultSchema });

	export const ok = createContractBuilder("200");
	export const created = createContractBuilder("201", { defaultSchema });
	export const accepted = createContractBuilder("202", { defaultSchema });
	export const nonAuthoritativeInformation = createContractBuilder("203", { defaultSchema });
	export const noContent = createContractBuilder("204", { noSchema: true });
	export const resetContent = createContractBuilder("205", { defaultSchema });
	export const partialContent = createContractBuilder("206", { defaultSchema });
	export const multiStatus = createContractBuilder("207", { defaultSchema });
	export const alreadyReported = createContractBuilder("208", { defaultSchema });
	export const imUsed = createContractBuilder("226", { defaultSchema });

	export const multipleChoices = createContractBuilder("300", { noSchema: true });
	export const movedPermanently = createContractBuilder("301", { noSchema: true });
	export const found = createContractBuilder("302", { noSchema: true });
	export const seeOther = createContractBuilder("303", { noSchema: true });
	export const notModified = createContractBuilder("304", { noSchema: true });
	export const useProxy = createContractBuilder("305", { noSchema: true });
	export const switchProxy = createContractBuilder("306", { noSchema: true });
	export const temporaryRedirect = createContractBuilder("307", { noSchema: true });
	export const permanentRedirect = createContractBuilder("308", { noSchema: true });

	export const badRequest = createContractBuilder("400", { defaultSchema });
	export const unauthorized = createContractBuilder("401", { defaultSchema });
	export const paymentRequired = createContractBuilder("402", { defaultSchema });
	export const forbidden = createContractBuilder("403", { defaultSchema });
	export const notFound = createContractBuilder("404", { defaultSchema });
	export const methodNotAllowed = createContractBuilder("405", { defaultSchema });
	export const notAcceptable = createContractBuilder("406", { defaultSchema });
	export const proxyAuthenticationRequired = createContractBuilder("407", { defaultSchema });
	export const requestTimeout = createContractBuilder("408", { defaultSchema });
	export const conflict = createContractBuilder("409", { defaultSchema });
	export const gone = createContractBuilder("410", { defaultSchema });
	export const lengthRequired = createContractBuilder("411", { defaultSchema });
	export const preconditionFailed = createContractBuilder("412", { defaultSchema });
	export const contentTooLarge = createContractBuilder("413", { defaultSchema });
	export const uriTooLong = createContractBuilder("414", { defaultSchema });
	export const unsupportedMediaType = createContractBuilder("415", { defaultSchema });
	export const rangeNotSatisfiable = createContractBuilder("416", { defaultSchema });
	export const expectationFailed = createContractBuilder("417", { defaultSchema });
	export const imATeapot = createContractBuilder("418", { defaultSchema });
	export const misdirectedRequest = createContractBuilder("421", { defaultSchema });
	export const unprocessableContent = createContractBuilder("422", { defaultSchema });
	export const locked = createContractBuilder("423", { defaultSchema });
	export const failedDependency = createContractBuilder("424", { defaultSchema });
	export const tooEarly = createContractBuilder("425", { defaultSchema });
	export const upgradeRequired = createContractBuilder("426", { defaultSchema });
	export const preconditionRequired = createContractBuilder("428", { defaultSchema });
	export const tooManyRequests = createContractBuilder("429", { defaultSchema });
	export const requestHeaderFieldsTooLarge = createContractBuilder("431", { defaultSchema });
	export const unavailableForLegalReasons = createContractBuilder("451", { defaultSchema });

	export const internalServerError = createContractBuilder("500", { defaultSchema });
	export const notImplemented = createContractBuilder("501", { defaultSchema });
	export const badGateway = createContractBuilder("502", { defaultSchema });
	export const serviceUnavailable = createContractBuilder("503", { defaultSchema });
	export const gatewayTimeout = createContractBuilder("504", { defaultSchema });
	export const httpVersionNotSupported = createContractBuilder("505", { defaultSchema });
	export const variantAlsoNegotiates = createContractBuilder("506", { defaultSchema });
	export const insufficientStorage = createContractBuilder("507", { defaultSchema });
	export const loopDetected = createContractBuilder("508", { defaultSchema });
	export const notExtended = createContractBuilder("510", { defaultSchema });
	export const networkAuthenticationRequired = createContractBuilder("511", { defaultSchema });

	export const serverSentEventsContractKind = createCoreLibKind("server-sent-events-response-contract");
	export interface ServerSentEventsContract<
		GenericCode extends SuccessResponseCode = SuccessResponseCode,
		GenericInformation extends string = string,
		GenericEvents extends Record<string, SupportedDataParser> = Record<string, SupportedDataParser>,
		GenericSchema extends SupportedDataParser = SupportedDataParser,
	> extends Kind<typeof serverSentEventsContractKind.definition> {
		code: GenericCode;
		information: GenericInformation;
		events: GenericEvents;
		body: GenericSchema;
	}

	const pingSchema = DP.empty();
	export function serverSentEvents<
		GenericInformation extends string,
		GenericMainEventSchema extends SupportedDataParser,
		GenericEvents extends Record<string, SupportedDataParser> = {},
	>(
		information: GenericInformation,
		mainEventSchema: GenericMainEventSchema,
		events: GenericEvents = {} as GenericEvents,
	): ServerSentEventsContract<
			"200",
			GenericInformation,
			& GenericEvents
			& {
				message: GenericMainEventSchema;
				ping: typeof pingSchema;
			}
		> {
		return serverSentEventsContractKind.setTo({
			code: <const>"200",
			information,
			events: {
				...events,
				message: mainEventSchema,
				ping: pingSchema,
			},
			body: defaultSchema,
		});
	}

	export type Convert<
		GenericContract extends Contract | ServerSentEventsContract,
	> = GenericContract extends Contract
		? PredictedResponse<
			GenericContract["code"],
			GenericContract["information"],
			DP.Input<GenericContract["body"]>
		>
		: GenericContract extends ServerSentEventsContract
			? ServerSentEventsPredictedResponse<
				GenericContract["code"],
				GenericContract["information"],
				{
					[Prop in keyof GenericContract["events"]]: [
						Extract<Prop, string>,
						DP.Output<GenericContract["events"][Prop]>,
					]
				}[keyof GenericContract["events"]]
			>
			: never;

	export class Error extends kindHeritage(
		"contract-error",
		createCoreLibKind("contract-error"),
		ErrorClass,
	) {
		public constructor(
			public information: string,
			public detail: DP.DataParserError | string,
		) {
			super({}, [`Error executing the response contract with the information: "${information}"\nDetail: ${JSON.stringify(detail)}.`]);
		}
	}
}
