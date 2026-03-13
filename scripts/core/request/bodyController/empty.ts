import { createBodyController } from "./base";

export const EmptyBodyController = createBodyController<
	"empty",
	{}
>("empty");
export type EmptyBodyController = typeof EmptyBodyController;

export function controlBodyAsEmpty() {
	return EmptyBodyController.create({});
}
