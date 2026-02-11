import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { asserts, E } from "@duplojs/utils";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({ maxFileQuantity: 10 }),
})
	.extract({
		body: {
			myFile: SDPE.file(),
		},
	})
	.handler(
		ResponseContract.noContent("file.receive"),
		async({ myFile }, { response }) => {
			asserts(
				await myFile.move("files/store"),
				E.isRight,
			);

			return response("file.receive");
		},
	);
