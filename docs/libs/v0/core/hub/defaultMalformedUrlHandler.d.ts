import { ResponseContract } from "../response";
export declare const defaultMalformedUrlHandler: import("../steps").HandlerStep<{
    responseContract: NoInfer<ResponseContract.Contract<"400", "malformed-url", import("@duplojs/utils/dataParser").DataParserEmpty<{
        readonly errorMessage?: string | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>>>;
    theFunction: (__: import("..").Floor, { response }: import("../steps").HandlerStepFunctionParams<import("../response").ServerSentEventsPredictedResponse<"200" | "201" | "202" | "203" | "204" | "205" | "206" | "207" | "208" | "209" | "210" | "211" | "212" | "213" | "214" | "215" | "216" | "217" | "218" | "219" | "220" | "221" | "222" | "223" | "224" | "225" | "226" | "227" | "228" | "229" | "230" | "231" | "232" | "233" | "234" | "235" | "236" | "237" | "238" | "239" | "240" | "241" | "242" | "243" | "244" | "245" | "246" | "247" | "248" | "249" | "250" | "251" | "252" | "253" | "254" | "255" | "256" | "257" | "258" | "259" | "260" | "261" | "262" | "263" | "264" | "265" | "266" | "267" | "268" | "269" | "270" | "271" | "272" | "273" | "274" | "275" | "276" | "277" | "278" | "279" | "280" | "281" | "282" | "283" | "284" | "285" | "286" | "287" | "288" | "289" | "290" | "291" | "292" | "293" | "294" | "295" | "296" | "297" | "298" | "299", string, import("..").ServerSentEvents.DefinitionShape> | import("../response").PredictedResponse<import("../response").ResponseCode, string, unknown>>) => never;
    metadata: never[];
}>;
