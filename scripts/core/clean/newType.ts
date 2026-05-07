import { C, DPE } from "@duplojs/utils";
import "@duplojs/utils/clean";

interface ToExtractParserParams {
	coerce?: boolean;
}

declare module "@duplojs/utils/clean" {
	interface NewTypeHandler<
		GenericName extends string = string,
		GenericValue extends unknown = unknown,
		GenericConstraintsHandler extends readonly ConstraintHandler[] = readonly ConstraintHandler[],
		GenericInput extends unknown = unknown,
	> {
		toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<
			C.NewType<
				GenericName,
				GenericValue,
				GenericConstraintsHandler[number]["name"]
			>,
			unknown
		>;

		toEndpointSchema(): DPE.DataParserExtended<GenericValue>;
	}
}

C.createNewType.overrideHandler.setMethod(
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

C.createNewType.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => {
		const innerDataParser = self.internal.dataParser;

		return DPE.lazy(
			() => innerDataParser as never,
		);
	},
);
