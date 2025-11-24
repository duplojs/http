export function createCoreLibStringIdentifier<
	GenericValue extends string,
>(
	value: GenericValue,
) {
	return `@duplojs/http/core/${value}` as const;
}
