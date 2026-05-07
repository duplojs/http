import { DPE, type UnionToIntersection, C } from "@duplojs/utils";
import "@duplojs/utils/clean";

interface ToExtractParserParams {
	coerce?: boolean;
}

declare module "@duplojs/utils/clean" {
	interface ConstraintsSetHandler<
		GenericPrimitiveValue extends C.EligiblePrimitive = C.EligiblePrimitive,
		GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly [],
	> {
		toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<
			(
				& C.Primitive<GenericPrimitiveValue>
				& UnionToIntersection<
					GenericConstraintsHandler[number] extends infer InferredConstraint
						? InferredConstraint extends ConstraintHandler
							? C.GetConstraint<InferredConstraint>
							: never
						: never
				>
			),
			unknown
		>;

		toEndpointSchema(): DPE.DataParserExtended<GenericPrimitiveValue>;
	}
}

C.createConstraintsSet.overrideHandler.setMethod(
	"toExtractParser",
	(self, params) => {
		const innerDataParser = C.toMapDataParser(
			self,
			params,
		);

		return DPE.lazy(
			() => innerDataParser as never,
		);
	},
);

C.createConstraintsSet.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => {
		const innerDataParser = self.internal.dataParser;

		return DPE.lazy(
			() => innerDataParser as never,
		);
	},
);
