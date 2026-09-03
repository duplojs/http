import { type O } from "@duplojs/utils";

export interface EnvironmentCustom {}

export type Environment = (
	// oxlint-disable-next-line typescript/no-redundant-type-constituents
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
