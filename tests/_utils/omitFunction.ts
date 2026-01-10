import { A, type AnyValue, forward, innerPipe, isType, justReturn, O, P } from "@duplojs/utils";

export const omitFunctions: ((input: AnyValue | AnyValue[]) => AnyValue) = innerPipe(
	P.when(
		isType("function"),
		justReturn(undefined),
	),
	P.when(
		isType("array"),
		innerPipe(
			A.map((value) => omitFunctions(value)),
			A.filter((value) => value !== undefined),
		),
	),
	P.when(
		isType("object"),
		innerPipe(
			// need for not ignore kind
			Object.entries,
			A.map(
				([key, value]) => O.entry(
					key,
					omitFunctions(value as AnyValue),
				),
			),
			A.filter(([, value]) => value !== undefined),
			O.fromEntries,
		),
	),
	P.otherwise(forward),
);
