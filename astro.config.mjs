// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';

// 把 ```mermaid 代码块转成 <pre class="mermaid">，
// 绕过语法高亮，交给前端的 mermaid.run() 渲染成图。
function remarkMermaid() {
	const escape = (s) =>
		s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	return (tree) => {
		visit(tree, 'code', (node) => {
			if (node.lang !== 'mermaid') return;
			node.type = 'html';
			node.value = `<pre class="mermaid">${escape(node.value)}</pre>`;
		});
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://binlongzhang.github.io',
	// base: '/personalBlog',
	devToolbar: {
		enabled: false,
	},
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkMath, remarkMermaid],
			// output: 'html' 让 KaTeX 只输出可见的 HTML 层，
			// 去掉 MathML(semantics+annotation) 两层重复文本，
			// 避免标题中的公式被 Astro 提取目录时拼成 mem0mem0mem0
			rehypePlugins: [[rehypeKatex, { output: 'html' }]],
		}),
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			weights: [400, 700],
			styles: ['normal'],
			display: 'swap',
		},
	],
});
