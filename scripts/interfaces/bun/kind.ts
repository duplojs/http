import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsHttpInterfacesBun: true;
	}
}

export const createInterfacesBunLibKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsHttpInterfacesBun",
);
