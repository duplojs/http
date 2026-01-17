import { type IsEqual } from "@duplojs/utils";

export type ObjectCanBeEmpty<
	GenericObject extends object,
> = IsEqual<
	{
		[Prop in keyof GenericObject]-?: undefined extends GenericObject[Prop]
			? true
			: false
	}[keyof GenericObject],
	true
>;
