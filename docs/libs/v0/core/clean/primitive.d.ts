import { DPE, C } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToExtractParserParams {
    coerce?: boolean;
}
declare module "@duplojs/utils/clean" {
    interface PrimitiveHandler<GenericValue extends C.EligiblePrimitive = C.EligiblePrimitive> {
        toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<C.Primitive<GenericValue>, unknown>;
        toEndpointSchema(): DPE.DataParserExtended<GenericValue, unknown>;
    }
}
export {};
