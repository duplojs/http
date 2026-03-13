import { type BodyControllerParams, controlBodyAsText, createBodyController, WrongBodyReaderImplementationError } from "@core";
import { asserts, E, unwrap } from "@duplojs/utils";

describe("createBodyController", () => {
	interface TestParams extends BodyControllerParams {
		test: string;
	}

	const BodyController = createBodyController<"test", TestParams>("test");

	it("check name", () => {
		expect(BodyController.name).toStrictEqual("test");
	});

	it("create bodyController", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(bodyController.name).toStrictEqual("test");
		expect(bodyController.params).toStrictEqual({ test: "" });
	});

	it("create createReaderImplementation", () => {
		const spy = vi.fn();
		const bodyReaderImplementation = BodyController.createReaderImplementation(spy);
		expect(bodyReaderImplementation.read).toStrictEqual(spy);
	});

	it("bodyController tryToCreateReader", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(bodyController.tryToCreateReader({} as never)).toStrictEqual(E.fail());
		const bodyReaderImplementation = BodyController.createReaderImplementation(vi.fn());
		expect(bodyController.tryToCreateReader(bodyReaderImplementation)).toStrictEqual(E.success(expect.any(Object)));
	});

	it("bodyController createReaderOrThrow", () => {
		const bodyController = BodyController.create({ test: "" });
		expect(() => bodyController.createReaderOrThrow({} as never)).toThrowError(WrongBodyReaderImplementationError);
		const bodyReaderImplementation = BodyController.createReaderImplementation(vi.fn());
		expect(bodyController.tryToCreateReader(bodyReaderImplementation)).toStrictEqual(expect.any(Object));
	});

	it("WrongBodyReaderImplementationError", () => {
		expect(new WrongBodyReaderImplementationError("test", {} as never)).instanceOf(Error);
	});

	it("reader", async() => {
		const bodyController = BodyController.create({ test: "" });
		const spy = vi.fn();
		const bodyReaderImplementation = BodyController.createReaderImplementation(spy);
		const reader = bodyController.tryToCreateReader(bodyReaderImplementation);
		asserts(reader, E.isRight);
		await unwrap(reader).read({} as never);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("is", () => {
		const bodyController = BodyController.create({ test: "" });

		expect(BodyController.is(bodyController)).toStrictEqual(true);
		expect(BodyController.is(controlBodyAsText())).toStrictEqual(false);
	});
});
