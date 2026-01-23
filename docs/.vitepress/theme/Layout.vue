<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme, {VPHomeContent} from 'vitepress/theme'
const { frontmatter } = useData()

const { Layout } = DefaultTheme

</script>

<template>
  <Layout>
    <template #home-hero-after>
		<VPHomeContent v-if="frontmatter.imageSrc">
			<img class="home-gif" :src="frontmatter.imageSrc">
			<span class="home-gif-span"></span>
		</VPHomeContent>
    </template>
  </Layout>
</template>

<style scoped>
.home-gif {
	padding: 15px;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0 0 20px var(--vp-c-brand-1);
}

.home-gif-span {
	display: block;
	height: 48px;
}

@media (min-width: 960px) {
  .home-gif-span {
	height: 64px;
  }
}
</style>