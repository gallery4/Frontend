<script lang="ts">
	import 'vidstack/bundle';
	import { goto } from '$app/navigation';
	import { swipeable } from '@react2svelte/swipeable';
	import type { SwipeEventData } from '@react2svelte/swipeable';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';
	import closeIcon from '@mdi/svg/svg/close.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { createBrowseURL } from '$lib/navigation';
	import { page } from '$app/state';

	const { data } = $props();
	const nextURL = $derived(data.nextURL);
	const previousURL = $derived(data.previousURL);

	let isImageLoaded = $state(false);

	function handler(e: CustomEvent<SwipeEventData>) {
		switch (e.detail.dir) {
			case 'Left':
				if (nextURL) {
					goto(nextURL);
				}
				break;

			case 'Right':
				if (previousURL) {
					goto(previousURL);
				}
				break;
		}
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery 4 - {data.filename}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title={data.filename} />

		<div class="top-18 fixed bottom-0 end-0 start-0">
			{#if !isImageLoaded}
				<div class="fixed inset-1/2">
					<span class="loading loading-spinner loading-xl"></span>
				</div>
			{/if}

			<div class="h-full w-full" use:swipeable onswiped={handler}>
				<img
					alt={data.filename}
					src={data.imageURL}
					class="h-full w-full"
					style="object-fit:contain;"
					onload={() => (isImageLoaded = true)}					
				/>
			</div>

			<button
				class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
				onclick={() => {
					if (previousURL != null) goto(previousURL);
				}}
			>
				<Icon data={prevIcon} class="mx-auto"></Icon>
			</button>

			<button
				class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
				onclick={() => {
					if (nextURL != null) goto(nextURL);
				}}
			>
				<Icon data={nextIcon} class="mx-auto"></Icon>
			</button>

			<button
				class="fixed end-2 top-20 z-10 h-20 w-20 cursor-pointer text-gray-500/50 hover:text-gray-500"
				onclick={() => goto(createBrowseURL(data.parent, page.url.origin, data.filename))}
			>
				<Icon data={closeIcon} class="mx-auto"></Icon>
			</button>
		</div>
	</Content>

	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Action</li>
			<li>
				<a class="btn" href={data.mediaURL} target="_blank">
					<Icon data={downloadIcon} /> Get
				</a>
			</li>
		</ul>
		<Breadcrumb path={data.parent} />
	</SideBar>
</Container>
