import { createCoreLibKind } from "@core/kind";
import { type WrappedValue, type Kind, wrapValue } from "@duplojs/utils";

export const metadataKind = createCoreLibKind<
	"metadata",
	string
>("metadata");

export interface Metadata<
	GenericName extends string,
	GenericValue extends string,
> extends Kind<typeof metadataKind.definition, GenericName>, WrappedValue<GenericValue> {

}

export interface MetadataHandler<
	GenericName extends string,
	GenericValue extends string,
> {
	name: GenericName;

	<
		GenericMetadataValue extends GenericValue,
	>(
		value: GenericMetadataValue
	): Metadata<GenericName, GenericMetadataValue>;

	is<
		GenericInput extends unknown,
	>(
		input: GenericInput
	): input is Extract<
		GenericInput,
		Metadata<GenericName, any>
	>;
}

export function createMetadata<
	GenericName extends string,
	GenericValue extends string,
>(
	name: NoInfer<GenericName>,
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

	metadataHandler.name = name;

	metadataHandler.is = function(input: unknown) {
		return metadataKind.has(input)
		&& metadataKind.getValue(input) === name;
	};

	return metadataHandler as never;
}
