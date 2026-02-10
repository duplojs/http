import { asFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { asserts, E } from "@duplojs/utils";

useRouteBuilder("POST", "/documents")
	.extract({
		body: asFormData(
			{
				myFile: SDPE.file(),
			},
			{
				maxFileQuantity: 10,
			},
		),
	})
	.handler(
		ResponseContract.noContent("file.receive"),
		async({ body }, { response }) => {
			asserts(
				await body.myFile.move("files/store"),
				E.isRight,
			);

			return response("file.receive");
		},
	);
