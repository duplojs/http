import { type SimplifyTopLevel, type AnyFunction, type ObjectKey } from "@duplojs/utils";

export interface NarrowingInput<
	N extends ObjectKey = ObjectKey,
	V extends unknown = unknown,
> {
	inputName: N;
	value: V;
}

export type ShrinkerInput<
	T extends object = object,
> = SimplifyTopLevel<{
	[P in keyof T]: (value: T[P]) => NarrowingInput<P, T[P]>
}>;

export type GetNarrowingInput<
	I extends ShrinkerInput,
	N extends keyof I = keyof I,
> = ReturnType<
	I[N] extends AnyFunction ? I[N] : never
>;

export function createNarrowingInput<T extends object>(): ShrinkerInput<T> {
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
