import { type SimplifyTopLevel, type AnyFunction, type ObjectKey } from "@duplojs/utils";

export interface NarrowingInput<
	GenericName extends ObjectKey = ObjectKey,
	GenericValue extends unknown = unknown,
> {
	inputName: GenericName;
	value: GenericValue;
}

export type ShrinkerInput<
	GenericInput extends object = object,
> = SimplifyTopLevel<{
	[Props in keyof GenericInput]: (value: GenericInput[Props]) => NarrowingInput<Props, GenericInput[Props]>
}>;

export type GetNarrowingInput<
	GenericShrinkerInput extends ShrinkerInput,
	GenericShrinkerKey extends keyof GenericShrinkerInput = keyof GenericShrinkerInput,
> = ReturnType<
	GenericShrinkerInput[GenericShrinkerKey] extends AnyFunction ? GenericShrinkerInput[GenericShrinkerKey] : never
>;

export function createNarrowingInput<
	GenericInput extends object,
>(): ShrinkerInput<GenericInput> {
	return new Proxy<
		Record<ObjectKey, AnyFunction>
	>(
		{},
		{
			get(target, name: string) {
				return (
					target[name] ||= (value): NarrowingInput => ({
						inputName: name,
						value,
					})
				);
			},
		},
	) as any;
}
