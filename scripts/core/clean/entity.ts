import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends, pipe, O, A, innerPipe, P, isType, asserts } from "@duplojs/utils";
import { createEntity, type EntityRawProperties, type EntityProperties, type EntityPropertiesDefinition, newTypeHandlerKind, type EntityPropertyDefinition } from "@duplojs/utils/clean";

interface ToEndpointSchemaParams {
	addEntityName?: boolean | string;
}

declare module "@duplojs/utils/clean" {
	interface EntityHandler<
		GenericName extends string = string,
		GenericPropertiesDefinition extends EntityPropertiesDefinition = EntityPropertiesDefinition,
	> {
		toExtractParser<
			GenericEntityProperties extends EntityProperties<GenericPropertiesDefinition>,
			const GenericKey extends keyof GenericEntityProperties = keyof GenericEntityProperties,
		>(
			keys?: GenericKey[]
		): ReturnType<
			typeof DPE.object<{
				[Prop in GenericKey]: DP.Contract<GenericEntityProperties[Prop], unknown>
			}>
		>;

		toEndpointSchema<
			GenericEntityRawProperties extends EntityRawProperties<GenericPropertiesDefinition>,
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

function propertiesDefinitionToSchema(
	definition: EntityPropertyDefinition,
	method: "toExtractParser" | "toEndpointSchema",
): DP.Contract<unknown> {
	return pipe(
		definition,
		P.when(
			newTypeHandlerKind.has,
			(value) => value[method](),
		),
		P.when(
			isType("array"),
			innerPipe(
				A.map((element) => element[method]()),
				(options) => {
					asserts(options, A.minElements(1));

					return DP.union(options);
				},
			),
		),
		P.otherwise(
			(definition) => pipe(
				definition.type,
				(subDefinition) => propertiesDefinitionToSchema(subDefinition, method),
				(dataParser) => {
					if (definition.inArray) {
						return pipe(
							dataParser,
							DP.array,
							(dataParser) => typeof definition.inArray === "object"
								&& typeof definition.inArray.min === "number"
								? dataParser.addChecker(DP.checkerArrayMin(definition.inArray.min))
								: dataParser,
							(dataParser) => typeof definition.inArray === "object"
								&& typeof definition.inArray.max === "number"
								? dataParser.addChecker(DP.checkerArrayMax(definition.inArray.max))
								: dataParser,
						);
					}

					return dataParser;
				},
				(dataParser) => definition.nullable === true
					? DP.nullable(dataParser)
					: dataParser,
			),
		),
	);
}

createEntity.overrideHandler.setMethod(
	"toExtractParser",
	(self, keys) => pipe(
		self.propertiesDefinition,
		O.entries,
		A.filter(([key]) => keys === undefined || A.includes(keys, key)),
		A.map(
			([key, value]) => O.entry(key, propertiesDefinitionToSchema(value, "toExtractParser")),
		),
		O.fromEntries,
		DPE.object,
	),
);

createEntity.overrideHandler.setMethod(
	"toEndpointSchema",
	(self, keys, params) => pipe(
		self.propertiesDefinition,
		O.entries,
		A.filter(([key]) => keys === undefined || A.includes(keys, key)),
		A.map(
			([key, value]) => O.entry(key, propertiesDefinitionToSchema(value, "toEndpointSchema")),
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
	) as never,
);
