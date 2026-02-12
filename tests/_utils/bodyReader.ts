import { createBodyController } from "@core";
import { asserts, E, isType, unwrap } from "@duplojs/utils";

export function createBodyReader(theFunction: () => unknown = () => undefined) {
	const BodyController = createBodyController("test");
	const bodyController = BodyController.create({});
	const bodyReader = unwrap(
		bodyController.tryToCreateReader(
			BodyController.createReaderImplementation(
				async() => {
					const result = await theFunction();

					if (result instanceof Error) {
						return E.error(result);
					}

					return E.success(result);
				},
			),
		),
	);
	asserts(bodyReader, isType("object"));

	return bodyReader;
}
