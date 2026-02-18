import { DPE } from "@duplojs/utils";
import { type EligiblePrimitive, type Primitive } from "@duplojs/utils/clean";
declare module "@duplojs/utils/clean" {
    interface PrimitiveHandler<GenericValue extends EligiblePrimitive = EligiblePrimitive> {
        toExtractParser(): DPE.ContractExtended<Primitive<GenericValue>, unknown>;
        toEndpointSchema(): DPE.ContractExtended<GenericValue, unknown>;
    }
}
