import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { createFileInterface } from "@duplojs/server-utils/file";
import { asserts, DPE, E } from "@duplojs/utils";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({
		maxFileQuantity: 10,
		bodyMaxSize: "1.5mb",
	}),
})
	.extract({
		body: {
			bool: DPE.coerce.boolean(),
			myFile: DPE.tuple([SDPE.file()]),
		},
	})
	.handler(
		ResponseContract.noContent("file.receive"),
		async({ myFile: [myFile] }, { response }) => {
			asserts(
				await myFile.move("files/store/picture.jpg"),
				E.isRight,
			);

			return response("file.receive");
		},
	);

useRouteBuilder("GET", "/documents/*")
	.handler(
		ResponseContract.ok("file.send", SDPE.file()),
		(__, { response }) => response("file.send", createFileInterface("files/fakeFiles/superTextFile.txt")),
	);
