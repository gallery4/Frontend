<script lang="ts">
	import { onMount } from 'svelte';
	import ePub, { Book } from 'epubjs';

	import { swipeable } from '@react2svelte/swipeable';
	import type { SwipeEventData } from '@react2svelte/swipeable';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';

	//import stylesheet from '$lib/app.css?url';

	const { src } = $props();

	let div: HTMLDivElement;
	let book: Book;
	let rendition: Rendition;

	async function render() {
		rendition = book.renderTo(div, {
			width: div.offsetWidth,
			height: div.offsetHeight /*, stylesheet: stylesheet*/
		});
		rendition.on('rendered', (e: Event, iframe: any) => {
			iframe?.iframe?.contentWindow.focus();

			swipeable(iframe);

			iframe.addEventListener('onswiped', onswiped);
		});
		await rendition.display();
	}

	onMount(async () => {
		book = ePub(src);
		await render();

		window.addEventListener('resize', () => {
			rendition.resize(div.offsetWidth, div.offsetHeight);
		});
	});

	async function onswiped(e: CustomEvent<SwipeEventData>) {
		console.log(e.detail);
		switch (e.detail.dir) {
			case 'Left':
				if (rendition) {
					await rendition.next();
				}
				break;

			case 'Right':
				if (rendition) {
					await rendition.prev();
				}
				break;
		}
	}
</script>

<div class="mx-auto h-full w-full max-w-[1024px]" bind:this={div}>
	<button
		class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={async () => {
			await rendition.prev();
		}}
	>
		<Icon data={prevIcon} class="mx-auto"></Icon>
	</button>

	<button
		class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
		onclick={async () => {
			await rendition.next();
		}}
	>
		<Icon data={nextIcon} class="mx-auto"></Icon>
	</button>
</div>
