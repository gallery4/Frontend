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
		<NavBar
			bind:showMenu
			title={data.filename}
			upUrl={createBrowseURL(data.parent, page.url.origin, data.filename)}
		/>
		<div class="fixed bottom-4 end-0 start-0 top-20 flex justify-center">
			<EpubViewer src={data.mediaURL} />
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
