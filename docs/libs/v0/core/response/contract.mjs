import { pipe, DP, kindHeritage } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';

const ErrorClass = Error;
var ResponseContract;
(function (ResponseContract) {
    ResponseContract.contractKind = createCoreLibKind("response-contract");
    function createContractBuilder(code, options) {
        return (information, ...[schema]) => pipe({
            code,
            information,
            body: (schema ?? options?.defaultSchema ?? DP.empty()),
        }, ResponseContract.contractKind.setTo);
    }
    const defaultSchema = DP.empty();
    ResponseContract.http100Continue = createContractBuilder("100", { defaultSchema });
    ResponseContract.switchingProtocols = createContractBuilder("101", { defaultSchema });
    ResponseContract.processing = createContractBuilder("102", { defaultSchema });
    ResponseContract.earlyHints = createContractBuilder("103", { defaultSchema });
    ResponseContract.ok = createContractBuilder("200");
    ResponseContract.created = createContractBuilder("201", { defaultSchema });
    ResponseContract.accepted = createContractBuilder("202", { defaultSchema });
    ResponseContract.nonAuthoritativeInformation = createContractBuilder("203", { defaultSchema });
    ResponseContract.noContent = createContractBuilder("204", { noSchema: true });
    ResponseContract.resetContent = createContractBuilder("205", { defaultSchema });
    ResponseContract.partialContent = createContractBuilder("206", { defaultSchema });
    ResponseContract.multiStatus = createContractBuilder("207", { defaultSchema });
    ResponseContract.alreadyReported = createContractBuilder("208", { defaultSchema });
    ResponseContract.imUsed = createContractBuilder("226", { defaultSchema });
    ResponseContract.multipleChoices = createContractBuilder("300", { noSchema: true });
    ResponseContract.movedPermanently = createContractBuilder("301", { noSchema: true });
    ResponseContract.found = createContractBuilder("302", { noSchema: true });
    ResponseContract.seeOther = createContractBuilder("303", { noSchema: true });
    ResponseContract.notModified = createContractBuilder("304", { noSchema: true });
    ResponseContract.useProxy = createContractBuilder("305", { noSchema: true });
    ResponseContract.switchProxy = createContractBuilder("306", { noSchema: true });
    ResponseContract.temporaryRedirect = createContractBuilder("307", { noSchema: true });
    ResponseContract.permanentRedirect = createContractBuilder("308", { noSchema: true });
    ResponseContract.badRequest = createContractBuilder("400", { defaultSchema });
    ResponseContract.unauthorized = createContractBuilder("401", { defaultSchema });
    ResponseContract.paymentRequired = createContractBuilder("402", { defaultSchema });
    ResponseContract.forbidden = createContractBuilder("403", { defaultSchema });
    ResponseContract.notFound = createContractBuilder("404", { defaultSchema });
    ResponseContract.methodNotAllowed = createContractBuilder("405", { defaultSchema });
    ResponseContract.notAcceptable = createContractBuilder("406", { defaultSchema });
    ResponseContract.proxyAuthenticationRequired = createContractBuilder("407", { defaultSchema });
    ResponseContract.requestTimeout = createContractBuilder("408", { defaultSchema });
    ResponseContract.conflict = createContractBuilder("409", { defaultSchema });
    ResponseContract.gone = createContractBuilder("410", { defaultSchema });
    ResponseContract.lengthRequired = createContractBuilder("411", { defaultSchema });
    ResponseContract.preconditionFailed = createContractBuilder("412", { defaultSchema });
    ResponseContract.contentTooLarge = createContractBuilder("413", { defaultSchema });
    ResponseContract.uriTooLong = createContractBuilder("414", { defaultSchema });
    ResponseContract.unsupportedMediaType = createContractBuilder("415", { defaultSchema });
    ResponseContract.rangeNotSatisfiable = createContractBuilder("416", { defaultSchema });
    ResponseContract.expectationFailed = createContractBuilder("417", { defaultSchema });
    ResponseContract.imATeapot = createContractBuilder("418", { defaultSchema });
    ResponseContract.misdirectedRequest = createContractBuilder("421", { defaultSchema });
    ResponseContract.unprocessableContent = createContractBuilder("422", { defaultSchema });
    ResponseContract.locked = createContractBuilder("423", { defaultSchema });
    ResponseContract.failedDependency = createContractBuilder("424", { defaultSchema });
    ResponseContract.tooEarly = createContractBuilder("425", { defaultSchema });
    ResponseContract.upgradeRequired = createContractBuilder("426", { defaultSchema });
    ResponseContract.preconditionRequired = createContractBuilder("428", { defaultSchema });
    ResponseContract.tooManyRequests = createContractBuilder("429", { defaultSchema });
    ResponseContract.requestHeaderFieldsTooLarge = createContractBuilder("431", { defaultSchema });
    ResponseContract.unavailableForLegalReasons = createContractBuilder("451", { defaultSchema });
    ResponseContract.internalServerError = createContractBuilder("500", { defaultSchema });
    ResponseContract.notImplemented = createContractBuilder("501", { defaultSchema });
    ResponseContract.badGateway = createContractBuilder("502", { defaultSchema });
    ResponseContract.serviceUnavailable = createContractBuilder("503", { defaultSchema });
    ResponseContract.gatewayTimeout = createContractBuilder("504", { defaultSchema });
    ResponseContract.httpVersionNotSupported = createContractBuilder("505", { defaultSchema });
    ResponseContract.variantAlsoNegotiates = createContractBuilder("506", { defaultSchema });
    ResponseContract.insufficientStorage = createContractBuilder("507", { defaultSchema });
    ResponseContract.loopDetected = createContractBuilder("508", { defaultSchema });
    ResponseContract.notExtended = createContractBuilder("510", { defaultSchema });
    ResponseContract.networkAuthenticationRequired = createContractBuilder("511", { defaultSchema });
    ResponseContract.serverSentEventsContractKind = createCoreLibKind("server-sent-events-response-contract");
    function serverSentEvents(information, mainEventSchema, events = {}) {
        return ResponseContract.serverSentEventsContractKind.setTo({
            code: "200",
            information,
            events: {
                ...events,
                message: mainEventSchema,
            },
            body: defaultSchema,
        });
    }
    ResponseContract.serverSentEvents = serverSentEvents;
    ResponseContract.streamContractKind = createCoreLibKind("stream-response-contract");
    function stream(information, schema) {
        return ResponseContract.streamContractKind.setTo({
            code: "200",
            information,
            flux: schema,
            body: defaultSchema,
        });
    }
    ResponseContract.stream = stream;
    ResponseContract.streamTextContractKind = createCoreLibKind("stream-text-response-contract");
    const defaultStreamTextSchema = DP.string();
    function streamText(information) {
        return ResponseContract.streamTextContractKind.setTo({
            code: "200",
            information,
            flux: defaultStreamTextSchema,
            body: defaultSchema,
        });
    }
    ResponseContract.streamText = streamText;
    class Error extends kindHeritage("contract-error", createCoreLibKind("contract-error"), ErrorClass) {
        information;
        detail;
        constructor(information, detail) {
            super({}, [`Error executing the response contract with the information: "${information}"`]);
            this.information = information;
            this.detail = detail;
        }
    }
    ResponseContract.Error = Error;
})(ResponseContract || (ResponseContract = {}));

export { ResponseContract };
