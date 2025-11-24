import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsHttpInterfacesNode: true;
	}
}

export const createInterfacesNodeLibKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsHttpInterfacesNode",
);
