import { DPE, type UnionToIntersection } from "@duplojs/utils";
import { type EligiblePrimitive, type GetConstraint, type Primitive } from "@duplojs/utils/clean";
declare module "@duplojs/utils/clean" {
    interface ConstraintsSetHandler<GenericPrimitiveValue extends EligiblePrimitive = EligiblePrimitive, GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly []> {
        toExtractParser(): DPE.ContractExtended<(Primitive<GenericPrimitiveValue> & UnionToIntersection<GenericConstraintsHandler[number] extends infer InferredConstraint ? InferredConstraint extends ConstraintHandler ? GetConstraint<InferredConstraint> : never : never>), unknown>;
        toEndpointSchema(): DPE.ContractExtended<GenericPrimitiveValue>;
    }
}
