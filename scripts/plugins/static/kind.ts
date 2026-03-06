import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsStaticPlugin: true;
	}
}

export const createStaticPluginKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsStaticPlugin",
);
