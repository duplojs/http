import { type WrappedValue, type Kind, type IsEqual, type Or, type IsExtends } from "@duplojs/utils";
export declare const metadataKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/metadata", string>>;
export interface Metadata<GenericName extends string = string, GenericValue extends unknown = unknown> extends Kind<typeof metadataKind.definition, GenericName>, WrappedValue<GenericValue> {
}
export interface MetadataHandler<GenericName extends string, GenericValue extends unknown> {
    dataName: GenericName;
    <GenericMetadataValue extends GenericValue>(...args: Or<[
        IsEqual<GenericValue, unknown>,
        IsEqual<GenericValue, never>,
        IsExtends<undefined, GenericValue>
    ]> extends true ? [value?: GenericMetadataValue] : [value: GenericMetadataValue]): Metadata<GenericName, GenericMetadataValue>;
    is(input: unknown): input is Metadata<GenericName, any>;
}
export declare function createMetadata<GenericName extends string, GenericValue extends unknown = unknown>(name: GenericName): MetadataHandler<GenericName, GenericValue>;
