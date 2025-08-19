<script lang="ts">
	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';
	import closeIcon from '@mdi/svg/svg/close.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import SvelteReader from 'svelte-reader';
	import { createBrowseURL } from '$lib/navigation.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { data } = $props();

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery 4 - {data.filename}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title={data.filename} />
		<div class="fixed bottom-4 end-0 start-0 top-20 flex justify-center">
			<SvelteReader
				url={data.mediaURL}
				title="&nbsp;"
				getRendition={() => {}}
				tocChanged={() => {}}
			/>
		</div>

		<button
			class="fixed end-2 top-20 z-10 h-20 w-20 cursor-pointer text-gray-500/50 hover:text-gray-500"
			onclick={() => goto(createBrowseURL(data.parent, page.url.origin, data.filename))}
		>
			<Icon data={closeIcon} class="mx-auto"></Icon>
		</button>
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
