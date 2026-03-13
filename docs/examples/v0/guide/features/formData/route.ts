import { controlBodyAsFormData, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { SDPE } from "@duplojs/server-utils";
import { A, asyncPipe, DPE, E, Path } from "@duplojs/utils";

useRouteBuilder("POST", "/documents", {
	bodyController: controlBodyAsFormData({ maxFileQuantity: 5 }),
})
	.extract({
		body: {
			userId: DPE.coerce.number(),
			files: DPE.object({
				alt: DPE.string(),
				file: SDPE.file().mimeType(["image/png", "image/jpeg"]),
				description: DPE.string(),
			}).array(),
		},
	})
	.handler(
		ResponseContract.noContent("files.receive"),
		async({ files, userId }, { response }) => {
			const { success, error } = await asyncPipe(
				files,
				A.map(
					async({ file, ...rest }, { index }) => asyncPipe(
						file.move(
							Path.resolveRelative([
								"super/path",
								`${userId}-${index}.${file.getExtension() ?? ""}`,
							]),
						),
						E.whenIsRight(
							(fileInterface) => E.success({
								path: fileInterface.path,
								...rest,
							}),
						),
					),
				),
				(promises) => Promise.all(promises),
				A.group(
					(element, { output }) => E.isRight(element)
						? output("success", element)
						: output("error", element),
				),
			);

			return response("files.receive");
		},
	);
