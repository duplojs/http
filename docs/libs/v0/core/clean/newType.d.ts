import { DPE } from "@duplojs/utils";
import { type NewType } from "@duplojs/utils/clean";
declare module "@duplojs/utils/clean" {
    interface NewTypeHandler<GenericName extends string = string, GenericValue extends unknown = unknown, GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly ConstraintHandler[], GenericInput extends unknown = unknown> {
        toExtractParser(): DPE.ContractExtended<NewType<GenericName, GenericValue, GenericConstraintsHandler[number]["name"]>, unknown>;
        toEndpointSchema(): DPE.ContractExtended<GenericValue>;
    }
}
