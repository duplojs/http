import { type DP, DPE, C } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToExtractParserParams {
    coerce?: boolean;
}
declare module "@duplojs/utils/clean" {
    interface ConstraintHandler<GenericName extends string = string, GenericPrimitiveValue extends C.EligiblePrimitive = C.EligiblePrimitive, GenericCheckers extends readonly DP.DataParserChecker[] = readonly DP.DataParserChecker[]> {
        toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<C.ConstrainedType<GenericName, GenericPrimitiveValue>, unknown>;
        toEndpointSchema(): DPE.DataParserExtended<GenericPrimitiveValue>;
    }
}
export {};
