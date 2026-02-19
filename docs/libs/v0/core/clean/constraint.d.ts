import { type DP, DPE } from "@duplojs/utils";
import { type ConstrainedType, type EligiblePrimitive } from "@duplojs/utils/clean";
declare module "@duplojs/utils/clean" {
    interface ConstraintHandler<GenericName extends string = string, GenericPrimitiveValue extends EligiblePrimitive = EligiblePrimitive, GenericCheckers extends readonly DP.DataParserChecker[] = readonly DP.DataParserChecker[]> {
        toExtractParser(): DPE.ContractExtended<ConstrainedType<GenericName, GenericPrimitiveValue>, unknown>;
        toEndpointSchema(): DPE.ContractExtended<GenericPrimitiveValue>;
    }
}
