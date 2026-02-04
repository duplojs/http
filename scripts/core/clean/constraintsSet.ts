import { A, DPE, keyWrappedValue, O, pipe, type UnionToIntersection } from "@duplojs/utils";
import { constrainedTypeKind, createConstraintsSet, type EligiblePrimitive, type GetConstraint, type Primitive } from "@duplojs/utils/clean";

declare module "@duplojs/utils/clean" {
	interface ConstraintsSetHandler<
		GenericPrimitiveValue extends EligiblePrimitive = EligiblePrimitive,
		GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly [],
	> {
		toExtractParser(): DPE.ContractExtended<
			(
				& Primitive<GenericPrimitiveValue>
				& UnionToIntersection<
					GenericConstraintsHandler[number] extends infer InferredConstraint
						? InferredConstraint extends ConstraintHandler
							? GetConstraint<InferredConstraint>
							: never
						: never
				>
			),
			unknown
		>;

		toEndpointSchema(): DPE.ContractExtended<GenericPrimitiveValue>;
	}
}

createConstraintsSet.overrideHandler.setMethod(
	"toExtractParser",
	(self) => {
		const checkers = A.flatMap(
			self.constraints,
			({ checkers }) => checkers,
		);

		const dataParserWithCheckers = self
			.primitiveHandler
			.dataParser
			.addChecker(...checkers as never);

		const constraintsKindValue = pipe(
			self.constraints,
			A.map(({ name }) => O.entry(name, null)),
			O.fromEntries,
		);

		const valueContainer = constrainedTypeKind.setTo(
			{},
			constraintsKindValue,
		);

		const dataParser = DPE.transform(
			dataParserWithCheckers,
			(input) => ({
				...valueContainer,
				[keyWrappedValue]: input,
			}) as never,
		);

		return dataParser;
	},
);

createConstraintsSet.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => {
		const checkers = A.flatMap(
			self.constraints,
			({ checkers }) => checkers,
		);

		const dataParserWithCheckers = self
			.primitiveHandler
			.dataParser
			.addChecker(...checkers as never) as never;

		return DPE.lazy(
			() => dataParserWithCheckers,
		);
	},
);
