import { A, DPE, keyWrappedValue, O, pipe } from "@duplojs/utils";
import { constrainedTypeKind, createNewType, type NewType, newTypeKind } from "@duplojs/utils/clean";

declare module "@duplojs/utils/clean" {
	interface NewTypeHandler<
		GenericName extends string = string,
		GenericValue extends unknown = unknown,
		GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly ConstraintHandler[],
		GenericInput extends unknown = unknown,
	> {
		toExtractParser(): DPE.ContractExtended<
			NewType<
				GenericName,
				GenericValue,
				GenericConstraintsHandler[number]["name"]
			>,
			unknown
		>;

		toEndpointSchema(): DPE.ContractExtended<GenericValue>;
	}
}

createNewType.overrideHandler.setMethod(
	"toExtractParser",
	(self) => {
		const constraintsKindValue = pipe(
			self.constraints,
			A.map(({ name }) => O.entry(name, null)),
			O.fromEntries,
		);

		const valueContainer = newTypeKind.setTo(
			constrainedTypeKind.setTo(
				{},
				constraintsKindValue,
			),
			self.name,
		);

		const dataParser = DPE.transform(
			self.dataParser,
			(input) => ({
				...valueContainer,
				[keyWrappedValue]: input,
			}) as never,
		);

		return dataParser;
	},
);

createNewType.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => DPE.lazy(() => self.dataParser),
);
