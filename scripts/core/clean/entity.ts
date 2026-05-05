import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends, pipe, O, A, C, type MaybeArray } from "@duplojs/utils";
import "@duplojs/utils/clean";

interface ToExtractParserParams {
	coerce?: boolean;
}

interface ToEndpointSchemaParams {
	addEntityName?: boolean | string;
}

declare module "@duplojs/utils/clean" {
	interface EntityHandler<
		GenericName extends string = string,
		GenericPropertiesDefinition extends C.EntityPropertiesDefinition = C.EntityPropertiesDefinition,
	> {

		toExtractParser<
			GenericEntityProperties extends C.EntityProperties<GenericPropertiesDefinition>,
			const GenericKey extends MaybeArray<keyof GenericEntityProperties>
			= readonly (keyof GenericEntityProperties)[],
		>(
			keys?: GenericKey,
			params?: ToExtractParserParams
		): GenericKey extends readonly any[]
			? ReturnType<
				typeof DPE.object<
					SimplifyTopLevel<
						& {
							[Prop in GenericKey[number]]: DP.Contract<GenericEntityProperties[Prop], unknown>
						}
					>
				>
			>
			: DP.Contract<GenericEntityProperties[Extract<GenericKey, string>], unknown>;

		toEndpointSchema<
			GenericEntityRawProperties extends C.EntityRawProperties<GenericPropertiesDefinition>,
			const GenericKey extends MaybeArray<keyof GenericEntityRawProperties>
			= readonly (keyof GenericEntityRawProperties)[],
			const GenericParams extends (ToEndpointSchemaParams) = {},
		>(
			keys?: GenericKey,
			params?: (GenericParams | ToEndpointSchemaParams) & (
				GenericKey extends string
					? never
					: unknown
			),
		): GenericKey extends readonly any[]
			? ReturnType<
				typeof DPE.object<
					SimplifyTopLevel<
						& {
							[Prop in GenericKey[number]]: DP.Contract<GenericEntityRawProperties[Prop], unknown>
						}
						& (
							IsEqual<GenericParams["addEntityName"], true> extends true
								? { [Prop in "_entityName"]: DP.Contract<GenericName, unknown> }
								: {}
						)
						& (
							IsExtends<GenericParams["addEntityName"], string> extends true
								? { [Prop in "_entityName"]: DP.Contract<`${GenericName}/${GenericParams["addEntityName"]}`, unknown> }
								: {}
						)
					>
				>
			>
			: DP.Contract<GenericEntityRawProperties[Extract<GenericKey, string>], unknown>;
	}
}

C.createEntity.overrideHandler.setMethod(
	"toExtractParser",
	(self, keys, params) => {
		if (typeof keys === "string") {
			return C.entityPropertyDefinitionToDataParser(
				self.propertiesDefinition[keys]!,
				(newTypeHandler) => newTypeHandler.toExtractParser(params),
			);
		}

		return pipe(
			self.propertiesDefinition,
			O.entries,
			A.filter(([key]) => keys === undefined || A.includes(keys, key)),
			A.map(
				([key, value]) => O.entry(
					key,
					C.entityPropertyDefinitionToDataParser(
						value,
						(newTypeHandler) => newTypeHandler.toExtractParser(params),
					),
				),
			),
			O.fromEntries,
			DPE.object,
		);
	},
);

C.createEntity.overrideHandler.setMethod(
	"toEndpointSchema",
	(self, keys, params) => {
		if (typeof keys === "string") {
			return C.entityPropertyDefinitionToDataParser(
				self.propertiesDefinition[keys]!,
				(newTypeHandler) => newTypeHandler.toEndpointSchema(),
			);
		}

		return pipe(
			self.propertiesDefinition,
			O.entries,
			A.filter(([key]) => keys === undefined || A.includes(keys, key)),
			A.map(
				([key, value]) => O.entry(
					key,
					C.entityPropertyDefinitionToDataParser(
						value,
						(newTypeHandler) => newTypeHandler.toEndpointSchema(),
					),
				),
			),
			O.fromEntries,
			(shape) => typeof params?.addEntityName !== "undefined"
				? {
					...shape,
					_entityName: typeof params.addEntityName === "string"
						? DP.literal(`${self.name}/${params.addEntityName}`)
						: DP.literal(self.name),
				}
				: shape,
			DPE.object,
		);
	},
);
