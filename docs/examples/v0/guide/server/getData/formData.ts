import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { asserts, DPE, E, O, Path } from "@duplojs/utils";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({ maxFileQuantity: 5 }),
})
	.extract({
		body: {
			userId: DPE.coerce.number(),
			files: SDPE.file().array().max(3),
		},
	})
	.handler(
		ResponseContract.noContent("files.receive"),
		async({ files, userId }, { response }) => {
			for (const [index, file] of O.entries(files)) {
				asserts(
					await file.move(
						Path.resolveRelative([
							"new/path/of/file",
							`${userId}-${index}${file.getExtension() ?? ""}`,
						]),
					),
					E.isRight,
				);
			}

			return response("files.receive");
		},
	);
