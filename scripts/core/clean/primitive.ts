import { DPE, keyWrappedValue } from "@duplojs/utils";
import { createPrimitive, type EligiblePrimitive, type Primitive } from "@duplojs/utils/clean";

declare module "@duplojs/utils/clean" {
	interface PrimitiveHandler<
		GenericValue extends EligiblePrimitive = EligiblePrimitive,
	> {
		toExtractParser(): DPE.ContractExtended<
			Primitive<GenericValue>,
			unknown
		>;

		toEndpointSchema(): DPE.ContractExtended<
			GenericValue,
			unknown
		>;
	}
}

createPrimitive.overrideHandler.setMethod(
	"toExtractParser",
	(self) => {
		const dataParser = DPE.transform(
			self.dataParser,
			(input) => ({
				[keyWrappedValue]: input,
			}) as never,
		);

		return dataParser;
	},
);

createPrimitive.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => DPE.lazy(
		() => self.dataParser,
	),
);
