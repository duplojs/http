import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsHttpCore: true;
	}
}

export const createCoreLibKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsHttpCore",
);
