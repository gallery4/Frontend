<script lang="ts">
	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	import * as pdfjsLib from 'pdfjs-dist';
	import { onMount } from 'svelte';

	import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import { createSwipeAttachment } from '$lib/touch_gestures';

	export const ssr = false;

	const { url } = $props();
	var pdf: pdfjsLib.PDFDocumentProxy | undefined = $state(undefined);
	var pageNumber = $state(1);

	let canvas: HTMLCanvasElement;
	let div: HTMLDivElement;

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

	onMount(async () => {
		pdf = await pdfjsLib.getDocument({ url: url }).promise;
		await render();

		window.addEventListener('resize', () => {
			if (pdf) render();
		});
	});

	async function render(): Promise<void> {
		if (!pdf) {
			return;
		}
		// Fetch the first page
		const page = await pdf.getPage(pageNumber);
		const viewport = page.getViewport({ scale: 1 });

		// Prepare canvas using PDF page dimensions

		const context = canvas.getContext('2d');

		const canvasAspect = viewport.width / viewport.height;
		const offsetAspect = div.offsetWidth / div.offsetHeight;

		// Calculate scale based on container's dimension.
		// Try to fit the screen on the height size.

		// TODO: calculate the scale based on width size on TBD conditons.

		const aspect = Math.min(canvasAspect, offsetAspect);
		const width = div.offsetHeight * aspect;
		const scale = width / viewport.width;

		const scaledViewPort = page.getViewport({ scale });

		canvas.width = scaledViewPort.width;
		canvas.height = scaledViewPort.height;

		if (context == null) {
			return;
		}

		// Render PDF page into canvas context
		var renderContext = {
			canvas,
			canvasContext: context,
			viewport: scaledViewPort
		};
		await page.render(renderContext).promise;
	}

	$effect(() => {
		if (pdf) render();
	});

	const swipeAttachment = createSwipeAttachment((e) => {
		switch (e.direction) {
			case Hammer.DIRECTION_LEFT:
				if (pageNumber < (pdf?.numPages ?? 0)) pageNumber++;
				break;
				break;

			case Hammer.DIRECTION_RIGHT:
				if (pageNumber > 1) pageNumber--;
				break;
		}
	});
</script>

<div class="h-full w-full" bind:this={div} {@attach swipeAttachment}>
	<canvas bind:this={canvas} class="mx-auto my-auto"></canvas>

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
