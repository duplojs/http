import type { Theme } from "vitepress";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";

import "@shikijs/vitepress-twoslash/style.css";
import "virtual:group-icons.css";
import "./style.css";

export default {
	extends: DefaultTheme,
	Layout: Layout,
	enhanceApp({ app }) {
		app.use(TwoslashFloatingVue);
	},
} satisfies Theme;
