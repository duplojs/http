import { DPE, C } from "@duplojs/utils";
import "@duplojs/utils/clean";

interface ToExtractParserParams {
	coerce?: boolean;
}

declare module "@duplojs/utils/clean" {
	interface PrimitiveHandler<
		GenericValue extends C.EligiblePrimitive = C.EligiblePrimitive,
	> {
		toExtractParser(params?: ToExtractParserParams): DPE.DataParserExtended<
			C.Primitive<GenericValue>,
			unknown
		>;

		toEndpointSchema(): DPE.DataParserExtended<
			GenericValue,
			unknown
		>;
	}
}

C.createPrimitive.overrideHandler.setMethod(
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

C.createPrimitive.overrideHandler.setMethod(
	"toEndpointSchema",
	(self) => {
		const innerDataParser = self.dataParser;

		return DPE.lazy(
			() => innerDataParser as never,
		);
	},
);
