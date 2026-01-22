import { type O } from "@duplojs/utils";
export interface EnvironmentCustom {
}
export type Environment = (EnvironmentCustom[O.GetPropsWithValue<EnvironmentCustom, true>] | "DEV" | "PROD" | "BUILD");
