import { type O } from "@duplojs/utils";
export interface HostCustom {
}
export type Hosts = (HostCustom[O.GetPropsWithValue<HostCustom, true>] | "::" | "0.0.0.0" | "localhost" | "127.0.0.1" | "::1");
