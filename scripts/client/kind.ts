import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsHttpClient: true;
	}
}

export const createClientKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsHttpClient",
);
