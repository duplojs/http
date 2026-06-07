import { DPE, type UnionToIntersection, C } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToExtractParserParams {
    coerce?: boolean;
}
declare module "@duplojs/utils/clean" {
    interface ConstraintsSetHandler<GenericPrimitiveValue extends C.EligiblePrimitive = C.EligiblePrimitive, GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly []> {
        toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<(C.Primitive<GenericPrimitiveValue> & UnionToIntersection<GenericConstraintsHandler[number] extends infer InferredConstraint ? InferredConstraint extends ConstraintHandler ? C.GetConstraint<InferredConstraint> : never : never>), unknown>;
        toEndpointSchema(): DPE.DataParserExtended<GenericPrimitiveValue>;
    }
}
export {};
