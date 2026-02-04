import { type DP, DPE, keyWrappedValue } from "@duplojs/utils";
import { type ConstrainedType, constrainedTypeKind, createConstraint, type EligiblePrimitive } from "@duplojs/utils/clean";

declare module "@duplojs/utils/clean" {
	interface ConstraintHandler<
		GenericName extends string = string,
		GenericPrimitiveValue extends EligiblePrimitive = EligiblePrimitive,
		GenericCheckers extends readonly DP.DataParserChecker[] = readonly DP.DataParserChecker[],
	> {
		toExtractParser(): DPE.ContractExtended<
			ConstrainedType<
				GenericName,
				GenericPrimitiveValue
			>,
			unknown
		>;

		toEndpointSchema(): DPE.ContractExtended<GenericPrimitiveValue>;
	}
}

createConstraint.overrideHandler.setMethod(
	"toExtractParser",
	(self) => {
		const dataParserWithCheckers = self
			.primitiveHandler
			.dataParser
			.addChecker(...self.checkers as never);

		const valueContainer = constrainedTypeKind.setTo(
			{},
			{ [self.name]: null },
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

createConstraint.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => {
		const dataParser = self
			.primitiveHandler
			.dataParser
			.addChecker(...self.checkers as never) as never;

		return DPE.lazy(() => dataParser);
	},
);
