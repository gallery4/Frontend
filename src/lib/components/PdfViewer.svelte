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

	let renderMode = $state('ONE_PAGE');

	function determineRenderMode(
		src: { width: number; height: number },
		target: { width: number; height: number }
	): 'ONE_PAGE' | 'LEFT_RIGHT' | 'TOP_BOTTOM' {
		const srcAspect = src.width / src.height;
		const targetAspect = target.width / target.height;

		const srcOrientation = srcAspect > 1 ? 'landscape' : 'portrait';
		const targetOrientation = targetAspect > 1 ? 'landscape' : 'portrait';

		if (srcOrientation == targetOrientation) {
			return 'ONE_PAGE';
		} else if (targetOrientation == 'landscape') {
			return 'LEFT_RIGHT';
		} else {
			return 'TOP_BOTTOM';
		}
	}

	async function renderPage(pageNumber: number, target: { width: number; height: number }) {
		const page = await pdf?.getPage(pageNumber);
		const viewport = page?.getViewport({ scale: 1 });

		const scale = calculateScale(
			{ width: viewport?.width ?? 1, height: viewport?.height ?? 1 },
			target
		);

		const scaledViewPort = page?.getViewport({ scale });
		const context = canvas.getContext('2d');

		if (!context || !scaledViewPort) return;

		context.clearRect(0, 0, canvas.width, canvas.height);

		var renderContext = {
			canvas,
			canvasContext: context,
			viewport: scaledViewPort
		};
		await page?.render(renderContext).promise;

		return {
			size: { width: scaledViewPort.width, height: scaledViewPort.height },
			data: context?.getImageData(0, 0, target.width, target.height)
		};
	}

	async function renderOnePage(canvas: HTMLCanvasElement) {
		pageNumber = Math.min(Math.max(pageNumber, 1), pdf?.numPages ?? 0);

		const img = await renderPage(pageNumber, { width: canvas.width, height: canvas.height });

		const context = canvas.getContext('2d');
		context?.clearRect(0, 0, canvas.width, canvas.height);

		if (img) {
			context?.putImageData(
				img.data,
				(canvas.width - img.size.width) / 2,
				(canvas.height - img.size.height) / 2,
				0,
				0,
				img.size.width,
				img.size.height
			);
		}
	}

	async function renderLeftRight(canvas: HTMLCanvasElement) {
		const context = canvas.getContext('2d');

		const leftPage = pageNumber % 2 == 0 ? pageNumber : pageNumber - 1;
		const rightPage = pageNumber % 2 == 1 ? pageNumber : pageNumber + 1;

		pageNumber = leftPage;

		const img1 =
			leftPage > 0 && leftPage <= (pdf?.numPages ?? 0)
				? await renderPage(leftPage, { width: canvas.width / 2, height: canvas.height })
				: undefined;

		context?.clearRect(0, 0, canvas.width, canvas.height);

		const img2 =
			rightPage > 0 && rightPage <= (pdf?.numPages ?? 0)
				? await renderPage(rightPage, {
						width: canvas.width / 2,
						height: canvas.height
					})
				: undefined;

		context?.clearRect(0, 0, canvas.width, canvas.height);

		if (img1) {
			context?.putImageData(
				img1.data,
				canvas.width / 2 - img1.size.width,
				(canvas.height - img1.size.height) / 2,
				0,
				0,
				img1.size.width,
				img1.size.height
			);
		}

		if (img2) {
			context?.putImageData(
				img2.data,
				canvas.width / 2,
				(canvas.height - img2.size.height) / 2,
				0,
				0,
				img2.size.width,
				img2.size.height
			);
		}
	}

	async function renderTopBottom(canvas: HTMLCanvasElement) {
		const topPage = pageNumber % 2 == 0 ? pageNumber : pageNumber - 1;
		const bottomPage = pageNumber % 2 == 1 ? pageNumber : pageNumber + 1;

		pageNumber = topPage;

		const context = canvas.getContext('2d');

		const img1 =
			topPage > 0 && topPage <= (pdf?.numPages ?? 0)
				? await renderPage(topPage, {
						width: canvas.width,
						height: canvas.height / 2
					})
				: undefined;

		context?.clearRect(0, 0, canvas.width, canvas.height);
		const img2 =
			bottomPage > 0 && bottomPage <= (pdf?.numPages ?? 0)
				? await renderPage(bottomPage, {
						width: canvas.width,
						height: canvas.height / 2
					})
				: undefined;

		context?.clearRect(0, 0, canvas.width, canvas.height);

		if (img1) {
			context?.putImageData(
				img1.data,
				(canvas.width - img1.size.width) / 2,
				canvas.height / 2 - img1.size.height,
				0,
				0,
				img1.size.width,
				img1.size.height
			);
		}

		if (img2) {
			context?.putImageData(
				img2.data,
				canvas.width / 2,
				canvas.height / 2 - img2.size.height,
				0,
				0,
				img2.size.width,
				img2.size.height
			);
		}
	}

	onMount(async () => {
		pdf = await pdfjsLib.getDocument({ url: url }).promise;
		await render();

		window.addEventListener('resize', () => {
			if (pdf) render();
		});
	});

	function calculateScale(
		src: { width: number; height: number },
		target: { width: number; height: number }
	): number {
		const srcAspect = src.width / src.height;
		const targetAspect = target.width / target.height;
		const srcOrientation = srcAspect > 1 ? 'landscape' : 'portrait';
		const targetOrientation = targetAspect > 1 ? 'landscape' : 'portrait';

		if (srcOrientation == targetOrientation) {
			const scaleX = target.width / src.width;
			const scaledY = targetAspect * scaleX;

			if (scaledY > target.height) {
				return target.height / src.height;
			}

			return scaleX;
		} else {
			const scaleX = target.width / src.width;
			const scaledY = targetAspect * scaleX;

			if (scaledY < target.height) {
				return target.height / src.height;
			}

			return scaleX;
		}
	}

	async function render(): Promise<void> {
		if (!pdf) {
			return;
		}

		canvas.width = div.offsetWidth;
		canvas.height = div.offsetHeight;

		const page = await pdf?.getPage(pageNumber == 0 ? 1 : pageNumber);
		const viewport = page?.getViewport({ scale: 1 });

		renderMode = determineRenderMode(viewport, canvas);

		switch (renderMode) {
			case 'ONE_PAGE':
				await renderOnePage(canvas);
				break;
			case 'LEFT_RIGHT':
				await renderLeftRight(canvas);
				break;
			case 'TOP_BOTTOM':
				await renderTopBottom(canvas);
				break;
		}
	}

	$effect(() => {
		if (pdf) render();
	});

	const swipeAttachment = createSwipeAttachment((e) => {
		switch (e.direction) {
			case Hammer.DIRECTION_LEFT:
				next();
				break;

			case Hammer.DIRECTION_RIGHT:
				previous();
				break;
		}
	});

	function next() {
		if (renderMode == 'ONE_PAGE') {
			pageNumber = Math.min(Math.max(pageNumber + 1, 1), pdf?.numPages ?? 0);
		} else {
			pageNumber = pageNumber % 2 == 0 ? pageNumber : pageNumber + 1;
			pageNumber = Math.min(Math.max(pageNumber + 2, 0), pdf?.numPages ?? 0);
		}
	}

	function previous() {
		if (renderMode == 'ONE_PAGE') {
			pageNumber = Math.min(Math.max(pageNumber - 1, 1), pdf?.numPages ?? 0);
		} else {
			pageNumber = pageNumber % 2 == 0 ? pageNumber : pageNumber - 1;
			pageNumber = Math.min(Math.max(pageNumber - 2, 0), pdf?.numPages ?? 0);
		}
	}
</script>

<div class="h-full w-full" bind:this={div} {@attach swipeAttachment}>
	<canvas bind:this={canvas} class="mx-auto my-auto bg-transparent text-transparent"></canvas>

	<button
		class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={() => {
			previous();
		}}
	>
		<Icon data={prevIcon} class="mx-auto"></Icon>
	</button>

	<button
		class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={() => {
			next();
		}}
	>
		<Icon data={nextIcon} class="mx-auto"></Icon>
	</button>
</div>
