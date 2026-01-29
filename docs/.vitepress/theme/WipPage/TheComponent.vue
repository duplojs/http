<script setup lang="ts">
import { useData } from "vitepress";
import { computed, onBeforeUnmount, onMounted } from "vue";

const { page, theme } = useData();

const wip = computed(() => {
	const config = theme.value?.wip ?? {};
	return {
		title: config.title ?? "WIP",
		button: config.button ?? "Request this page",
	};
});

function createIssueLink() {
	const title = encodeURIComponent(
	`[DOC]: Page creation request: ${page.value.title || page.value.relativePath}`
	);
	const body = encodeURIComponent(
	`**Path:** ${page.value.relativePath}\n**URL:** ${typeof window !== "undefined" ? window.location.href : ""}`
	);
  
	return `https://github.com/duplojs/http/issues/new?title=${title}&body=${body}`;
}

const bodyClass = "wip-page";

onMounted(() => {
	if (typeof document !== "undefined") {
		document.body.classList.add(bodyClass);
	}
});

onBeforeUnmount(() => {
	if (typeof document !== "undefined") {
		document.body.classList.remove(bodyClass);
	}
});
</script>

<template>
	<div class="wip-container">
		<div class="wip-content">
			<h1 class="wip-title">
				{{ wip.title }}
			</h1>
			<a
				:href="createIssueLink()"
				target="_blank"
				rel="noopener noreferrer"
				class="wip-button"
			>
				{{ wip.button }}
			</a>
		</div>
	</div>
</template>

<style scoped>
.wip-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 60vh;
	padding: 2rem;
}

.wip-content {
	text-align: center;
	max-width: 600px;
	margin-top: 2rem;
}

.wip-title {
	font-size: clamp(5rem, 12vw, 20rem);
	font-weight: 700;
	margin: 0;
	color: var(--vp-c-text-3);
	line-height: 1.1;
	letter-spacing: 0.02em;
	text-transform: uppercase;
	text-shadow:
		0 2px 0 rgba(0, 0, 0, 0.08),
		0 8px 24px rgba(0, 0, 0, 0.12);
}

.wip-button {
	display: inline-block;
	padding: 1rem 2rem;
	color: var(--vp-c-text-3);
	text-decoration: none;
	font-size: 1.1rem;
	font-weight: 500;
	transition: all 0.3s ease;
}
</style>
<style>
body.wip-page .VPDoc {
  grid-template-columns: 1fr;
}

body.wip-page .VPDoc .aside,
body.wip-page .VPDoc .spacer {
  display: none !important;
}

body.wip-page .VPDoc .container,
body.wip-page .VPDoc .content,
body.wip-page .VPDoc .content-container,
body.wip-page .vp-doc {
  max-width: 100% !important;
}
</style>
