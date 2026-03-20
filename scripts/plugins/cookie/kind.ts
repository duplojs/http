import { createKindNamespace } from "@duplojs/utils";

declare module "@duplojs/utils" {
	interface ReservedKindNamespace {
		DuplojsCookiePlugin: true;
	}
}

export const createCookiePluginKind = createKindNamespace(
	// @ts-expect-error reserved kind namespace
	"DuplojsCookiePlugin",
);
