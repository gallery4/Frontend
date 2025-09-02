<script lang="ts">
	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { createBrowseURL } from '$lib/navigation.js';
	import { page } from '$app/state';
	import EpubViewer from '$lib/components/EpubViewer.svelte';

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
		<div class="fixed bottom-4 end-0 start-0 top-20 flex justify-center  bg-base-300">
			<EpubViewer src={data.mediaURL} />
		</div>
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Action</li>
			<li>
				<a class="btn" href={data.mediaURL} target="_blank">
					<Icon data={downloadIcon} class="fill-slate-400 stroke-slate-800"/> Get
				</a>
			</li>
		</ul>
	</SideBar>
</Container>
