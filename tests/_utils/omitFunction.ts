import { A, type AnyValue, forward, innerPipe, isType, justReturn, O, P } from "@duplojs/utils";

export const omitFunctions: ((input: AnyValue) => AnyValue) = innerPipe(
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
			O.entries.unsafe,
			A.map(
				([key, value]) => O.entry(
					key,
					omitFunctions(value),
				),
			),
			A.filter(([, value]) => value !== undefined),
			O.fromEntries,
		),
	),
	P.otherwise(forward),
);
