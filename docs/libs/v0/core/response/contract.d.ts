import { DP, type Kind, type IsEqual, type NeverCoalescing } from "@duplojs/utils";
import { type ResponseCode, type PredictedResponse, type ServerSentEventsPredictedResponse, type SuccessResponseCode, type StreamTextPredictedResponse } from ".";
import { type ForbiddenBigintDataParser } from "../types";
import { type StreamPredictedResponse } from "./streamPredicted";
export declare namespace ResponseContract {
    type SupportedDataParser = DP.DataParser;
    export const contractKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/response-contract", unknown>>;
    export interface Contract<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericSchema extends SupportedDataParser = SupportedDataParser> extends Kind<typeof contractKind.definition> {
        code: GenericCode;
        information: GenericInformation;
        body: GenericSchema;
    }
    const defaultSchema: DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>;
    export const http100Continue: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"100", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const switchingProtocols: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"101", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const processing: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"102", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const earlyHints: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"103", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const ok: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation, schema: GenericSchema & ForbiddenBigintDataParser<GenericSchema>) => NoInfer<Contract<"200", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const created: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"201", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const accepted: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"202", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const nonAuthoritativeInformation: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"203", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const noContent: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"204", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const resetContent: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"205", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const partialContent: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"206", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const multiStatus: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"207", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const alreadyReported: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"208", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const imUsed: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"226", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const multipleChoices: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"300", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const movedPermanently: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"301", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const found: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"302", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const seeOther: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"303", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const notModified: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"304", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const useProxy: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"305", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const switchProxy: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"306", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const temporaryRedirect: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"307", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const permanentRedirect: <GenericInformation extends string, GenericSchema extends SupportedDataParser = never>(information: GenericInformation) => NoInfer<Contract<"308", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const badRequest: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"400", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const unauthorized: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"401", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const paymentRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"402", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const forbidden: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"403", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const notFound: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"404", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const methodNotAllowed: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"405", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const notAcceptable: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"406", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const proxyAuthenticationRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"407", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const requestTimeout: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"408", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const conflict: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"409", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const gone: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"410", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const lengthRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"411", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const preconditionFailed: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"412", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const contentTooLarge: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"413", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const uriTooLong: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"414", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const unsupportedMediaType: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"415", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const rangeNotSatisfiable: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"416", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const expectationFailed: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"417", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const imATeapot: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"418", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const misdirectedRequest: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"421", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const unprocessableContent: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"422", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const locked: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"423", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const failedDependency: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"424", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const tooEarly: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"425", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const upgradeRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"426", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const preconditionRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"428", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const tooManyRequests: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"429", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const requestHeaderFieldsTooLarge: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"431", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const unavailableForLegalReasons: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"451", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const internalServerError: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"500", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const notImplemented: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"501", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const badGateway: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"502", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const serviceUnavailable: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"503", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const gatewayTimeout: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"504", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const httpVersionNotSupported: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"505", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const variantAlsoNegotiates: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"506", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const insufficientStorage: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"507", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const loopDetected: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"508", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const notExtended: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"510", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const networkAuthenticationRequired: <GenericInformation extends string, GenericSchema extends SupportedDataParser = DP.DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>(information: GenericInformation, schema?: (GenericSchema & ForbiddenBigintDataParser<GenericSchema>) | undefined) => NoInfer<Contract<"511", GenericInformation, NeverCoalescing<GenericSchema, DP.DataParserEmpty<DP.DataParserDefinitionEmpty>>>>;
    export const serverSentEventsContractKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-sent-events-response-contract", unknown>>;
    export interface ServerSentEventsContract<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericEvents extends Record<string, SupportedDataParser> = Record<string, SupportedDataParser>, GenericSchema extends SupportedDataParser = SupportedDataParser> extends Kind<typeof serverSentEventsContractKind.definition> {
        code: GenericCode;
        information: GenericInformation;
        events: GenericEvents;
        body: GenericSchema;
    }
    export function serverSentEvents<GenericInformation extends string, GenericMainEventSchema extends SupportedDataParser, GenericEvents extends Record<string, SupportedDataParser> = {}>(information: GenericInformation, mainEventSchema: GenericMainEventSchema, events?: GenericEvents): ServerSentEventsContract<"200", GenericInformation, (IsEqual<GenericEvents, Record<string, SupportedDataParser>> extends true ? {} : GenericEvents) & {
        message: GenericMainEventSchema;
    }, typeof defaultSchema>;
    export const streamContractKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/stream-response-contract", unknown>>;
    export interface StreamContract<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericFlux extends SupportedDataParser = SupportedDataParser, GenericSchema extends SupportedDataParser = SupportedDataParser> extends Kind<typeof streamContractKind.definition> {
        code: GenericCode;
        information: GenericInformation;
        flux: GenericFlux;
        body: GenericSchema;
    }
    export function stream<GenericInformation extends string, GenericSchema extends SupportedDataParser>(information: GenericInformation, schema: GenericSchema): StreamContract<"200", GenericInformation, GenericSchema, typeof defaultSchema>;
    export const streamTextContractKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/stream-text-response-contract", unknown>>;
    export interface StreamTextContract<GenericCode extends SuccessResponseCode = SuccessResponseCode, GenericInformation extends string = string, GenericFlux extends DP.Contract<string> = DP.Contract<string>, GenericSchema extends SupportedDataParser = SupportedDataParser> extends Kind<typeof streamTextContractKind.definition> {
        code: GenericCode;
        information: GenericInformation;
        flux: GenericFlux;
        body: GenericSchema;
    }
    const defaultStreamTextSchema: DP.DataParserString<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>;
    export function streamText<GenericInformation extends string>(information: GenericInformation): StreamTextContract<"200", GenericInformation, typeof defaultStreamTextSchema, typeof defaultSchema>;
    export type Contracts = (Contract | ServerSentEventsContract | StreamContract | StreamTextContract);
    export type Convert<GenericContract extends Contracts> = GenericContract extends Contract ? PredictedResponse<GenericContract["code"], GenericContract["information"], DP.Output<GenericContract["body"]>> : GenericContract extends ServerSentEventsContract ? ServerSentEventsPredictedResponse<GenericContract["code"], GenericContract["information"], {
        [Prop in keyof GenericContract["events"]]: [
            Extract<Prop, string>,
            DP.Output<GenericContract["events"][Prop]>
        ];
    }[keyof GenericContract["events"]]> : GenericContract extends StreamContract ? StreamPredictedResponse<GenericContract["code"], GenericContract["information"], DP.Output<GenericContract["flux"]>> : GenericContract extends StreamTextContract ? StreamTextPredictedResponse<GenericContract["code"], GenericContract["information"]> : never;
    const Error_base: new (params: {
        "@DuplojsHttpCore/contract-error"?: unknown;
    }, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => globalThis.Error & Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/contract-error", unknown>, unknown> & Kind<import("@duplojs/utils").KindDefinition<"contract-error", unknown>, unknown>;
    export class Error extends Error_base {
        information: string;
        detail: DP.DataParserError | string;
        constructor(information: string, detail: DP.DataParserError | string);
    }
    export {};
}
