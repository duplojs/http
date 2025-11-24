import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsHttpInterfacesDeno: true;
	}
}

export const createInterfacesDenoLibKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsHttpInterfacesDeno",
);
