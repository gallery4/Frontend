<script lang="ts">
	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	import * as pdfjsLib from 'pdfjs-dist';
	import { onMount } from 'svelte';
	import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';

	export const ssr = false;

	const { url } = $props();
	var pdf: pdfjsLib.PDFDocumentProxy | undefined = $state(undefined);
	var pageNumber = $state(1);

	let canvas: HTMLCanvasElement;

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

	onMount(async () => {
		pdf = await pdfjsLib.getDocument({ url: url }).promise;
		await render();
	});

	async function render(): Promise<void> {
		if (!pdf) {
			return;
		}
		// Fetch the first page
		var page = await pdf.getPage(pageNumber);

		var scale = 1;
		var viewport = page.getViewport({ scale: scale });

		// Prepare canvas using PDF page dimensions

		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		if (context == null) {
			return;
		}

		// Render PDF page into canvas context
		var renderContext = {
			canvas,
			canvasContext: context,
			viewport: viewport
		};
		await page.render(renderContext).promise;
	}

	$effect(() => {
		if (pdf) render();
	});
</script>

<div class="h-full w-full">
	<canvas class="d-block mx-auto" bind:this={canvas}></canvas>

	<button
		class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={() => {
			if (pageNumber > 1) pageNumber--;
		}}
	>
		<Icon data={prevIcon} class="mx-auto"></Icon>
	</button>

	<button
		class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={() => {
			if (pageNumber < (pdf?.numPages ?? 0)) pageNumber++;
		}}
	>
		<Icon data={nextIcon} class="mx-auto"></Icon>
	</button>
</div>
