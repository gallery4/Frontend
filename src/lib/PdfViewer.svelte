<script lang="ts">
	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	import * as pdfjsLib from 'pdfjs-dist';
	import { onMount } from 'svelte';
	import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils.js';
	import {
		Container,
		Icon,
		Pagination,
		PaginationItem,
		PaginationLink
	} from '@sveltestrap/sveltestrap';

	export const ssr = false;

	const { url } = $props();
	var pdf: pdfjsLib.PDFDocumentProxy = $state(null);
	var pageNumber = $state(1);

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

	onMount(async () => {
		pdf = await pdfjsLib.getDocument({ url: url }).promise;
		await render();
	});

	async function render(): Promise<void> {
		// Fetch the first page
		var page = await pdf.getPage(pageNumber);

		var scale = 1;
		var viewport = page.getViewport({ scale: scale });

		// Prepare canvas using PDF page dimensions
		var canvas = document.getElementById('the-canvas');
		var context = canvas.getContext('2d');
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		// Render PDF page into canvas context
		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		await page.render(renderContext).promise;
	}

	$effect(async () => {
		if (pdf) await render();
	});
</script>

<Container>
	<canvas id="the-canvas" class="mx-auto d-block mb-5"></canvas>
</Container>

<Pagination class="position-fixed bottom-0 start-50 translate-middle-x">
	<PaginationItem>
		<PaginationLink on:click={() => (pageNumber = 1)}>
			<Icon name="chevron-bar-left" />
		</PaginationLink>
	</PaginationItem>
	<PaginationItem disabled={pageNumber <= 1}>
		<PaginationLink on:click={() => pageNumber--}>
			<Icon name="chevron-left" />
		</PaginationLink>
	</PaginationItem>
	<PaginationItem active>
		<PaginationLink>
			{pageNumber}
		</PaginationLink>
	</PaginationItem>
	<PaginationItem disabled={pageNumber >= pdf?.numPages}>
		<PaginationLink on:click={() => pageNumber++}>
			<Icon name="chevron-right" />
		</PaginationLink>
	</PaginationItem>
	<PaginationItem>
		<PaginationLink on:click={() => (pageNumber = pdf.numPages)}>
			<Icon name="chevron-bar-right" />
		</PaginationLink>
	</PaginationItem>
</Pagination>
