import TheComponent from "./TheComponent.vue";

declare module "vitepress" {
	namespace DefaultTheme {
		interface Config {
			wip?: {
				title?: string;
				subtitle?: string;
				button?: string;
			};
		}
	}
}

export const WipPage = TheComponent;
