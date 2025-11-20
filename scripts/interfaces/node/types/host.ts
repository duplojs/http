import { type O } from "@duplojs/utils";

export interface HostCustom {}

export type Hosts = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| HostCustom[
		O.GetPropsWithValue<
			HostCustom,
			true
		>
	]
	| "::"
	| "0.0.0.0"
	| "localhost"
	| "127.0.0.1"
	| "::1"
);
