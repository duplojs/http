import { type O } from "@duplojs/utils";

export interface HostCustom {}

export type Hosts = O.GetPropsWithValue<
	HostCustom,
	true
>;
