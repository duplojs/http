import { C, DPE } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToExtractParserParams {
    coerce?: boolean;
}
declare module "@duplojs/utils/clean" {
    interface NewTypeHandler<GenericName extends string = string, GenericValue extends unknown = unknown, GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly ConstraintHandler[], GenericInput extends unknown = unknown> {
        toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<C.NewType<GenericName, GenericValue, GenericConstraintsHandler[number]["name"]>, unknown>;
        toEndpointSchema(): DPE.DataParserExtended<GenericValue>;
    }
}
export {};
