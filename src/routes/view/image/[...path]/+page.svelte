<script lang="ts">
	import 'vidstack/bundle';
	import { goto } from '$app/navigation';

	import Hammer from 'hammerjs';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { createBrowseURL } from '$lib/navigation';
	import { page } from '$app/state';
	import { createSwipeAttachment } from '$lib/touch_gestures';

	const { data } = $props();
	const nextURL = $derived(data.nextURL);
	const previousURL = $derived(data.previousURL);

	let isImageLoaded = $state(false);
	let oldImgSrc = $state('')

	$effect(()=>{
		if(oldImgSrc != data.imageURL){
			isImageLoaded = false;
			oldImgSrc = data.imageURL
		}
	})

	let showMenu = $state(false);

	const swipeAttachment = createSwipeAttachment((e) => {
		switch (e.direction) {
			case Hammer.DIRECTION_LEFT:
				if (nextURL) {
					goto(nextURL);
				}
				break;

			case Hammer.DIRECTION_RIGHT:
				if (previousURL) {
					goto(previousURL);
				}
				break;
		}
	});
</script>

<svelte:head>
	<title>Gallery 4 - {data.filename}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu upUrl={createBrowseURL(data.parent, page.url.origin, data.filename)}>
			<div class="hidden text-xl md:inline">
				<div class=" whitespace-nowrap">
					{data.filename}
				</div>
			</div>
		</NavBar>

		<div class="top-18 fixed bottom-0 end-0 start-0">
			{#if !isImageLoaded}
				<div class="fixed inset-1/2">
					<span class="loading loading-spinner loading-xl"></span>
				</div>
			{/if}

			<div class="h-full w-full" {@attach swipeAttachment}>
				<img
					alt={data.filename}
					src={data.imageURL}
					class="h-full w-full"
					style="object-fit:contain;"
					onload={() => (isImageLoaded = true)}
				/>
			</div>

			<button
				class="absolute inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
				onclick={() => {
					if (previousURL != null) goto(previousURL);
				}}
			>
				<Icon data={prevIcon} class="mx-auto"></Icon>
			</button>

			<button
				class="absolute inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
				onclick={() => {
					if (nextURL != null) goto(nextURL);
				}}
			>
				<Icon data={nextIcon} class="mx-auto"></Icon>
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
