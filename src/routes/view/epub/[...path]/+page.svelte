<script lang="ts">
	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import SvelteReader from 'svelte-reader';

	const { data } = $props();

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery 4 - {data.filename}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title={data.filename} />
		<div class="fixed bottom-0 end-0 start-0 top-20 h-full w-full">
			<SvelteReader
				url={data.mediaURL}
				title="&nbsp;"
				getRendition={() => {}}
				tocChanged={() => {}}
			/>
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
