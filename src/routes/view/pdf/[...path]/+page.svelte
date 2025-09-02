<script lang="ts">
	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PdfViewer from '$lib/components/PdfViewer.svelte';
	import { createBrowseURL } from '$lib/navigation';
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
		<div class="z-n1 fixed bottom-0 end-0 start-0 top-20 bg-base-300" >
			<PdfViewer url={data.mediaURL} />
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
	</SideBar>
</Container>
