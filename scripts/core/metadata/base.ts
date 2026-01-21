import { createCoreLibKind } from "@core/kind";
import { type WrappedValue, type Kind, wrapValue, type IsEqual, type Or, type IsExtends } from "@duplojs/utils";

export const metadataKind = createCoreLibKind<
	"metadata",
	string
>("metadata");

export interface Metadata<
	GenericName extends string = string,
	GenericValue extends unknown = unknown,
> extends Kind<typeof metadataKind.definition, GenericName>, WrappedValue<GenericValue> {

}

export interface MetadataHandler<
	GenericName extends string,
	GenericValue extends unknown,
> {
	dataName: GenericName;

	<
		GenericMetadataValue extends GenericValue,
	>(
		...args: Or<[
			IsEqual<GenericValue, unknown>,
			IsEqual<GenericValue, never>,
			IsExtends<undefined, GenericValue>,
		]> extends true
			? [value?: GenericMetadataValue]
			: [value: GenericMetadataValue]
	): Metadata<GenericName, GenericMetadataValue>;

	is(
		input: unknown
	): input is Metadata<GenericName, any>;
}

export function createMetadata<
	GenericName extends string,
	GenericValue extends unknown = unknown,
>(
	name: GenericName,
): MetadataHandler<
		GenericName,
		GenericValue
	> {
	function metadataHandler(value: GenericValue) {
		return metadataKind.setTo(
			wrapValue(value),
			name,
		);
	}

	metadataHandler.dataName = name;

	metadataHandler.is = function(input: unknown) {
		return metadataKind.has(input)
		&& metadataKind.getValue(input) === name;
	};

	return metadataHandler as never;
}
