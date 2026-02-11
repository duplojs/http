const firstElementInPathRegex = /^([^//]*)(?:\/\/)?/;
const getIndexRegex = /^\[(\d+)\]$/;

export function setAtPath(object: object | undefined, path: string, value: unknown): unknown {
	const firstElement = path.match(firstElementInPathRegex)![1]!;
	const index = firstElement.match(getIndexRegex)?.[1];

	let currentObject = object;

	if (currentObject === undefined) {
		if (index !== undefined) {
			currentObject = [];
		} else {
			currentObject = {};
		}
	}

	if (firstElement === path) {
		currentObject[(index ?? firstElement) as never] = value as never;

		return currentObject;
	}

	currentObject[(index ?? firstElement) as never] = setAtPath(
		currentObject[(index ?? firstElement) as never],
		path.replace(firstElementInPathRegex, ""),
		value,
	) as never;

	return currentObject;
}
