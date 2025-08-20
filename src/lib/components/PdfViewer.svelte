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

	function determineRenderMode(src: {width:number, height:number}, target: {width:number, height:number}): "ONE_PAGE" | "LEFT_RIGHT" | "TOP_BOTTOM" {
		const srcAspect = src.width/src.height;
		const targetAspect = target.width/target.height;

		const srcOrientation = srcAspect>1? "landscape": "portrait"
		const targetOrientation = targetAspect > 1 ? "landscape": "portrait"

		if(srcOrientation == targetOrientation){
			return "ONE_PAGE";
		}
		else if (targetOrientation == Orientation.LANDSCAPE){
			return "LEFT_RIGHT";
		} else {
			return "TOP_BOTTOM"
		} 
	}

	async function renderPage(pageNumber: number, target: {width: number, height: number}){
		const page = await pdf.getPage(pageNumber);
		const viewport = page.getViewport({ scale: 1 });

		const scale = target.width / viewport.width;
		const scaledViewPort = page.getViewport({ scale});
		const context = canvas.getContext('2d');

		var renderContext = {
			canvas,
			canvasContext: context,
			viewport: scaledViewPort
		};
		await page.render(renderContext).promise;

		return context?.getImageData(0,0, target.width, target.height)
	}

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

		canvas.width = div.offsetWidth
		canvas.height = div.offsetHeight
		
		const img1 = await renderPage(pageNumber, {width: canvas.width/2, height: canvas.height})
		const img2 = await renderPage(pageNumber+1, {width: canvas.width/2, height: canvas.height})

		const context = canvas.getContext('2d');
		context.putImageData(img1, 0, 0);
		context.putImageData(img2, canvas.width/2, 0);
	}

	$effect(() => {
		if (pdf) render();
	});

	const swipeAttachment = createSwipeAttachment((e) => {
		switch (e.direction) {
			case Hammer.DIRECTION_LEFT:
				if (pageNumber < (pdf?.numPages ?? 0)) pageNumber++;
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
