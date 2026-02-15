import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { asserts, DPE, E } from "@duplojs/utils";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({ maxFileQuantity: 10 }),
})
	.extract({
		body: {
			bool: DPE.coerce.boolean(),
			myFile: SDPE.file(),
		},
	})
	.handler(
		ResponseContract.noContent("file.receive"),
		async({ myFile }, { response }) => {
			asserts(
				await myFile.move("files/store/picture.jpg"),
				E.isRight,
			);

			return response("file.receive");
		},
	);
