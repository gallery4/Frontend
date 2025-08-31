<script lang="ts">
	import 'vidstack/bundle';
	import { goto } from '$app/navigation';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	import { createBrowseURL } from '$lib/navigation.js';
	import { page } from '$app/state';

	const { data } = $props();

	let showMenu = $state(false);
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

		<div class="mx-auto mt-16 max-w-[1024px]">
			<media-player class="d-block" title={data.filename} src={data.mediaURL}>
				<media-provider></media-provider>
				<media-audio-layout></media-audio-layout>
			</media-player>

			<div class="join mt-4 w-full">
				<button
					class="btn join-item flex-1"
					onclick={() => {
						if (data.previousURL) goto(data.previousURL);
					}}
				>
					<Icon data={prevIcon}></Icon>&nbsp;Previous
				</button>

				<button
					class="btn join-item flex-1"
					onclick={() => {
						if (data.nextURL) goto(data.nextURL);
					}}
				>
					<Icon data={nextIcon}></Icon>&nbsp;Next
				</button>
			</div>
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
