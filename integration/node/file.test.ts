import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { SF } from "@duplojs/server-utils";
import { asserts, E, sleep, stringToBytes } from "@duplojs/utils";
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

	it("send File", async() => {
		const formData = new FormData();
		formData.append("bool", "true");
		formData.append(
			"myFile/*\\[0]",
			await createFileToSend("files/fakeFiles/1mb.jpg", "//😄.jpg"),
		);

		await expect(
			fetch("http://localhost:8961/documents", {
				method: "POST",
				body: formData,
				headers: { "content-type-options": "advanced" },
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

		await sleep(500);

		expect(await SF.stat("files/store/picture.jpg")).toStrictEqual(
			E.success(
				expect.objectContaining({ sizeBytes: stringToBytes("1mb") }),
			),
		);
		asserts(await SF.remove("files/store/picture.jpg"), E.isRight);
		expect(await SF.readDirectory("files/upload")).toStrictEqual(
			E.success([".gitkeep"]),
		);
	});

	it("send File witch exceed limit", async() => {
		const formData = new FormData();
		formData.append("bool", "true");
		formData.append(
			"myFile/*\\[0]",
			await createFileToSend("files/fakeFiles/2mb.jpg", "//😄.jpg"),
		);

		await expect(
			fetch("http://localhost:8961/documents", {
				method: "POST",
				body: formData,
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			code: 422,
			body: "Error: Body size is bigger than 1572864.",
			headers: expect.arrayContaining([
				[
					"information",
					"extract-error",
				],
				[
					"extract-key",
					"request.body",
				],
			]),
		});

		await sleep(500);

		expect(await SF.readDirectory("files/upload")).toStrictEqual(
			E.success([".gitkeep"]),
		);
	});

	it("receive file", async() => {
		await expect(
			fetch("http://localhost:8961/documents/test", {
				method: "GET",
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "this is super file with super content.",
			headers: expect.arrayContaining([
				[
					"information",
					"file.send",
				],
				[
					"content-type",
					"text/plain",
				],
			]),
		});
	});
});
