import { type SF, TESTImplementation, setEnvironment } from "@duplojs/server-utils";
import { E, D } from "@duplojs/utils";
import { createHttpServer } from "@duplojs/http/node";

import { hub } from "@core";

describe("static plugin", async() => {
	const mockedModifiedAt = D.create("2026-03-02");

	setEnvironment("TEST");

	TESTImplementation.set("stat", async(path: string) => {
		await Promise.resolve();

		if (path === "files/fakeFiles") {
			return E.success({
				isFile: false,
				isDirectory: true,
				modifiedAt: null,
			} as SF.StatInfo);
		}

		if (path === "files/fakeFiles/superTextFile.txt") {
			return E.success({
				isFile: true,
				isDirectory: false,
				modifiedAt: mockedModifiedAt,
			} as SF.StatInfo);
		}

		return E.left("file-system-stat");
	});

	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8980,
	});

	afterAll(() => {
		TESTImplementation.clear();
		server.close();
	});

	it("file found", async() => {
		await expect(
			fetch("http://localhost:8980/static-file", {
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
					"resource.found",
				],
				[
					"content-type",
					"text/plain",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
				[
					"content-disposition",
					"attachment; filename=\"superTextFile.txt\"",
				],
			]),
		});
	});

	it("file notModified", async() => {
		await expect(
			fetch("http://localhost:8980/static-file", {
				method: "GET",
				headers: {
					"if-modified-since": mockedModifiedAt.toISOString(),
				},
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 304,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notModified",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
			]),
		});
	});

	it("file in folder found", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/superTextFile.txt", {
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
					"resource.found",
				],
				[
					"content-type",
					"text/plain",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
				[
					"content-disposition",
					"attachment; filename=\"superTextFile.txt\"",
				],
			]),
		});
	});

	it("file in folder notModified", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/superTextFile.txt", {
				method: "GET",
				headers: {
					"if-modified-since": mockedModifiedAt.toISOString(),
				},
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 304,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notModified",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
			]),
		});
	});

	it("file in folder notfound", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/unknown.txt", {
				method: "GET",
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 404,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notfound",
				],
			]),
		});
	});
});
