import { E } from "@duplojs/utils";
import { EmptyBodyController } from "@core/request";

export const defaultEmptyReaderImplementation = EmptyBodyController.createReaderImplementation(
	() => Promise.resolve(
		E.success(undefined),
	),
);
