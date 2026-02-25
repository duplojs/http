import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends, pipe, O, A, C } from "@duplojs/utils";
import "@duplojs/utils/clean";

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
			const GenericKey extends keyof GenericEntityProperties = keyof GenericEntityProperties,
		>(
			keys?: GenericKey[]
		): ReturnType<
			typeof DPE.object<
				SimplifyTopLevel<
					& {
						[Prop in GenericKey]: DP.Contract<GenericEntityProperties[Prop], unknown>
					}
				>
			>
		>;

		toEndpointSchema<
			GenericEntityRawProperties extends C.EntityRawProperties<GenericPropertiesDefinition>,
			const GenericKey extends keyof GenericEntityRawProperties = keyof GenericEntityRawProperties,
			const GenericParams extends ToEndpointSchemaParams = {},
		>(
			keys?: GenericKey[],
			params?: GenericParams | ToEndpointSchemaParams,
		): ReturnType<
			typeof DPE.object<
				SimplifyTopLevel<
					& {
						[Prop in GenericKey]: DP.Contract<GenericEntityRawProperties[Prop], unknown>
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
		>;
	}
}

C.createEntity.overrideHandler.setMethod(
	"toExtractParser",
	(self, keys) => pipe(
		self.propertiesDefinition,
		O.entries,
		A.filter(([key]) => keys === undefined || A.includes(keys, key)),
		A.map(
			([key, value]) => O.entry(
				key,
				C.entityPropertyDefinitionToDataParser(
					value,
					(newTypeHandler) => newTypeHandler.toExtractParser(),
				),
			),
		),
		O.fromEntries,
		DPE.object,
	),
);

C.createEntity.overrideHandler.setMethod(
	"toEndpointSchema",
	(self, keys, params) => pipe(
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
	),
);
