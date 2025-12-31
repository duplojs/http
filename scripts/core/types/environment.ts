import { type O } from "@duplojs/utils";

export interface EnvironmentCustom {}

export type Environment = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| EnvironmentCustom[
		O.GetPropsWithValue<
			EnvironmentCustom,
			true
		>
	]
	| "DEV"
	| "PROD"
	| "BUILD"
);
