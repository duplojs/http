import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { SF } from "@duplojs/server-utils";
import { asserts, E } from "@duplojs/utils";
import { createFileToSend } from "@utils";
import { resolve } from "path";

describe("receive file", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8961,
		uploadFolder: resolve(import.meta.dirname, "../files/upload"),
	});

	process.chdir(resolve(import.meta.dirname, "../"));

	afterAll(() => {
		server.close();
	});

	it("sendFile", async() => {
		const formData = new FormData();
		formData.append("bool", "true");
		formData.append(
			"myFile",
			await createFileToSend("files/fakeFiles/1mb.jpg", "//😄.jpg"),
		);

		await expect(
			fetch("http://localhost:8961/documents", {
				method: "POST",
				body: formData,
			})
				.then((response) => ({
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"file.receive",
				],
			]),
		});

		asserts(await SF.remove("files/store/picture.jpg"), E.isRight);
		expect(await SF.readDirectory("files/upload")).toStrictEqual(
			E.success([".gitkeep"]),
		);
	});
});
