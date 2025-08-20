<script lang="ts">
	import { onMount } from 'svelte';
	import ePub, { Book, Rendition } from 'epubjs';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';

	import Hammer, { DIRECTION_LEFT, DIRECTION_RIGHT } from 'hammerjs';

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
			console.log(e)
			console.log(iframe)
			iframe?.iframe?.contentWindow.focus();

			let manager = new Hammer.Manager(iframe.document.documentElement);
			let swipe = new Hammer.Swipe();
			manager.add(swipe);

			manager.on('swipe', async (e) => {
				switch (e.direction) {
					case DIRECTION_LEFT:
						if (rendition) {
							await rendition.next();
						}
						break;

					case DIRECTION_RIGHT:
						if (rendition) {
							await rendition.prev();
						}
						break;
				}
			});
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
