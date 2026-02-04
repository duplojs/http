import "@core";
import { C, DP, type DPE, E, type ExpectType, asserts } from "@duplojs/utils";

describe("entity", () => {
	it("toExtractParser", () => {
		const id = C.createNewType("id", DP.number(), C.NumberMin(1));
		const name = C.createNewType("name", DP.string());
		const age = C.createNewType("age", DP.number(), C.NumberMin(1));
		const user = C.createEntity("User", ({ nullable, array, union }) => ({
			id,
			name,
			role: union(name, age),
			tags: array(name),
			tagsMin: array(name, { min: 1 }),
			tagsMax: array(name, { max: 2 }),
			tagsRange: array(name, {
				min: 1,
				max: 2,
			}),
			nick: nullable(name),
			mixedNullable: nullable(union(name, age)),
		}));
		const parser = user.toExtractParser();

		asserts(parser.parse({
			id: 1,
			name: "John",
			role: "owner",
			tags: ["a"],
			tagsMin: ["a"],
			tagsMax: ["a", "b"],
			tagsRange: ["a"],
			nick: null,
			mixedNullable: 10,
		}), E.isRight);
		asserts(parser.parse({
			id: 1,
			name: "John",
			role: true,
			tags: ["a"],
			tagsMin: ["a"],
			tagsMax: ["a", "b"],
			tagsRange: ["a"],
			nick: null,
			mixedNullable: 10,
		}), E.isLeft);
		asserts(parser.parse({
			id: 1,
			name: "John",
			role: "owner",
			tags: ["a"],
			tagsMin: [],
			tagsMax: ["a", "b"],
			tagsRange: ["a"],
			nick: null,
			mixedNullable: 10,
		}), E.isLeft);
		asserts(parser.parse({
			id: 1,
			name: "John",
			role: "owner",
			tags: ["a"],
			tagsMin: ["a"],
			tagsMax: ["a", "b", "c"],
			tagsRange: ["a"],
			nick: null,
			mixedNullable: 10,
		}), E.isLeft);
		asserts(parser.parse({
			id: 1,
			name: "John",
			role: "owner",
			tags: ["a"],
			tagsMin: ["a"],
			tagsMax: ["a", "b"],
			tagsRange: [],
			nick: null,
			mixedNullable: 10,
		}), E.isLeft);

		expect(parser.parseOrThrow({
			id: 10,
			name: "John",
			role: "owner",
			tags: ["a"],
			tagsMin: ["a"],
			tagsMax: ["a"],
			tagsRange: ["a"],
			nick: "JJ",
			mixedNullable: "ok",
		})).toStrictEqual({
			id: id.createOrThrow(10),
			name: name.createOrThrow("John"),
			role: name.createOrThrow("owner"),
			tags: [name.createOrThrow("a")],
			tagsMin: [name.createOrThrow("a")],
			tagsMax: [name.createOrThrow("a")],
			tagsRange: [name.createOrThrow("a")],
			nick: name.createOrThrow("JJ"),
			mixedNullable: name.createOrThrow("ok"),
		});

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			{
				id: C.NewType<"id", number, "number-min-1">;
				name: C.NewType<"name", string>;
				role: C.NewType<"name", string> | C.NewType<"age", number, "number-min-1">;
				tags: readonly C.NewType<"name", string>[];
				tagsMin: readonly [C.NewType<"name", string>, ...C.NewType<"name", string>[]];
				tagsMax: readonly C.NewType<"name", string>[];
				tagsRange: readonly [C.NewType<"name", string>, ...C.NewType<"name", string>[]];
				nick: C.NewType<"name", string> | null;
				mixedNullable: C.NewType<"name", string> | C.NewType<"age", number, "number-min-1"> | null;
			},
			"strict"
		>;
	});

	it("toExtractParser with selected keys", () => {
		const id = C.createNewType("id", DP.number(), C.NumberMin(1));
		const name = C.createNewType("name", DP.string());
		const user = C.createEntity("User", () => ({
			id,
			name,
		}));
		const parser = user.toExtractParser(["id"]);

		asserts(parser.parse({ id: 1 }), E.isRight);
		asserts(parser.parse({ id: 0 }), E.isLeft);

		expect(parser.parseOrThrow({ id: 10 })).toStrictEqual({
			id: id.createOrThrow(10),
		});

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			{ id: C.NewType<"id", number, "number-min-1"> },
			"strict"
		>;
	});

	it("toEndpointSchema", () => {
		const id = C.createNewType("id", DP.number(), C.NumberMin(1));
		const name = C.createNewType("name", DP.string());
		const age = C.createNewType("age", DP.number(), C.NumberMin(1));
		const user = C.createEntity("User", ({ nullable, array, union }) => ({
			id,
			name,
			role: union(name, age),
			tags: array(name),
			nick: nullable(name),
		}));
		const parser = user.toEndpointSchema();

		asserts(parser.parse({
			id: 1,
			name: "John",
			role: "owner",
			tags: ["a", "b"],
			nick: null,
		}), E.isRight);
		asserts(parser.parse({
			id: 0,
			name: "John",
			role: "owner",
			tags: ["a", "b"],
			nick: null,
		}), E.isLeft);
		asserts(parser.parse({
			id: 1,
			name: "John",
			role: true,
			tags: ["a", "b"],
			nick: null,
		}), E.isLeft);

		expect(parser.parseOrThrow({
			id: 10,
			name: "test",
			role: 20,
			tags: ["x"],
			nick: "johnny",
		})).toStrictEqual({
			id: 10,
			name: "test",
			role: 20,
			tags: ["x"],
			nick: "johnny",
		});

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			{
				id: number;
				name: string;
				role: string | number;
				tags: readonly string[];
				nick: string | null;
			},
			"strict"
		>;
	});

	it("toEndpointSchema addEntityName", () => {
		const name = C.createNewType("name", DP.string());
		const id = C.createNewType("id", DP.number(), C.NumberMin(1));
		const user = C.createEntity("User", () => ({
			id,
			name,
		}));

		const parserWithBoolean = user.toEndpointSchema(["id"], { addEntityName: true });
		asserts(parserWithBoolean.parse({
			id: 1,
			_entityName: "User",
		}), E.isRight);
		asserts(parserWithBoolean.parse({
			id: 1,
			_entityName: "User/create",
		}), E.isLeft);

		type Check1 = ExpectType<
			DPE.Output<typeof parserWithBoolean>,
			{
				id: number;
				_entityName: "User";
			},
			"strict"
		>;

		const parserWithString = user.toEndpointSchema(["id"], { addEntityName: "create" });
		asserts(parserWithString.parse({
			id: 1,
			_entityName: "User/create",
		}), E.isRight);
		asserts(parserWithString.parse({
			id: 1,
			_entityName: "User",
		}), E.isLeft);

		type Check = ExpectType<
			DPE.Output<typeof parserWithString>,
			{
				id: number;
				_entityName: "User/create";
			},
			"strict"
		>;
	});
});
