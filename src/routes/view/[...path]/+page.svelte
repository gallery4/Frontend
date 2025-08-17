<script lang="ts">
	import 'vidstack/bundle';
	import { compareItems, determinFileType, extractSort, getFilenameFromKey } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { swipeable } from '@react2svelte/swipeable';
	import { writable } from 'svelte/store';
	import type { SwipeEventData } from '@react2svelte/swipeable';
	import SvelteReader from 'svelte-reader';
	import PdfViewer from '$lib/components/PdfViewer.svelte';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	export const ssr = false;

	const { data } = $props();
	const sort = persistBrowserLocal(writable('name ascending'), 'sort');
	const { sortBy, order } = $derived(extractSort($sort));

	const files = $derived(
		data.files.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	);

	const index = $derived(files.findIndex((e: any) => e.name == data.current));
	const previous = $derived(index > 0 ? files[index - 1].name : null);
	const next = $derived(index < files.length - 1 ? files[index + 1].name : null);

	const filetype = $derived(determinFileType(data.current));

	let isImageLoaded = $state(false);

	function handler(e: CustomEvent<SwipeEventData>) {
		switch (e.detail.dir) {
			case 'Left':
				if (next) {
					goto(`/view/${next}`);
				}
				break;

			case 'Right':
				if (previous) {
					goto(`/view/${previous}`);
				}
				break;
		}
	}

	let showMenu = $state(false);

	const mediaUrl = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', data.current);

		return url.toString();
	});
</script>

<svelte:head>
	<title>Gallery 4 - {getFilenameFromKey(data.current, 'image')}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title={getFilenameFromKey(data.current, 'image')} />
		{#if filetype == 'image'}
			<div class="top-18 fixed bottom-0 end-0 start-0">
				{#if !isImageLoaded}
					<div class="h-full w-full">
						<span class="loading loading-dots loading-sm"></span>
					</div>
				{/if}

				<div class="h-full w-full" use:swipeable onswiped={handler}>
					<img
						alt={getFilenameFromKey(data.current, 'image')}
						src={(() => {
							const url = new URL('/api/image', page.url.origin);
							url.searchParams.set('path', data.current);
							return url.toString();
						})()}
						class="h-full w-full"
						style="object-fit:contain;"
						onload={() => (isImageLoaded = true)}
					/>
				</div>

				<button
					class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
					onclick={() => {
						if (previous != null) goto(`/view/${previous}`);
					}}
				>
					<Icon data={prevIcon} class="mx-auto"></Icon>
				</button>

				<button
					class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
					onclick={() => {
						if (next != null) goto(`/view/${next}`);
					}}
				>
					<Icon data={nextIcon} class="mx-auto"></Icon>
				</button>
			</div>
		{:else if filetype == 'pdf'}
			<div class="z-n1 fixed start-0 top-0 top-20 h-full w-full overflow-auto">
				<PdfViewer url={mediaUrl} />
			</div>
		{:else if filetype == 'epub'}
			<div class="fixed bottom-0 end-0 start-0 top-20 h-full w-full">
				<SvelteReader url={mediaUrl} title="&nbsp;" getRendition={() => {}} tocChanged={() => {}} />
			</div>
		{:else if filetype == 'video'}
			<div class="mx-auto mt-4 max-w-[1024px]">
				<media-player
					class="d-block"
					title={getFilenameFromKey(data.current, 'media')}
					src={mediaUrl}
				>
					<media-provider></media-provider>
					<media-video-layout></media-video-layout>
				</media-player>

				<div class="join py-4">
					<button
						class="btn join-item"
						onclick={() => {
							if (previous != null) goto(`/view/${previous}`);
						}}
					>
						<Icon data={prevIcon}></Icon>&nbsp;Previous
					</button>

					<button
						class="btn join-item"
						onclick={() => {
							if (next != null) goto(`/view/${next}`);
						}}
					>
						<Icon data={nextIcon}></Icon>&nbsp;Next
					</button>
				</div>
			</div>
		{:else if filetype == 'audio'}
			<div class="mx-auto mt-16 max-w-[1024px]">
				<media-player
					class="d-block"
					title={getFilenameFromKey(data.current, 'media')}
					src={mediaUrl}
				>
					<media-provider></media-provider>
					<media-audio-layout></media-audio-layout>
				</media-player>

				<div class="join py-4">
					<button
						class="btn join-item"
						onclick={() => {
							if (previous != null) goto(`/view/${previous}`);
						}}
					>
						<Icon data={prevIcon}></Icon>&nbsp;Previous
					</button>

					<button
						class="btn join-item"
						onclick={() => {
							if (next != null) goto(`/view/${next}`);
						}}
					>
						<Icon data={nextIcon}></Icon>&nbsp;Next
					</button>
				</div>
			</div>
		{/if}
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Action</li>
			<li>
				<a class="btn" href={mediaUrl} target="_blank">
					<Icon data={downloadIcon} /> Get
				</a>
			</li>
		</ul>

		<Breadcrumb path={data.parent} />
	</SideBar>
</Container>
