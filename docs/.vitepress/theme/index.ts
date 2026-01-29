import type { Theme } from "vitepress";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import { WipPage } from "./WipPage";
import "@shikijs/vitepress-twoslash/style.css";
import "virtual:group-icons.css";
import "./style.css";

export default {
	extends: DefaultTheme,
	Layout: Layout,
	enhanceApp({ app }) {
		app.use(TwoslashFloatingVue);
		app.component("wip", WipPage);
	},
} satisfies Theme;
